
'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '../mongodb';
import Listing from '@/models/Listing';
import User from '@/models/User';
import type { Listing as ListingType, SearchParams } from '@/lib/types';
import { getAuthenticatedUserProfile } from './user.actions';

interface CreateListingParams {
  brand: string;
  model: string;
  ram: number;
  storage: number;
  condition: "new" | "like_new" | "good" | "fair";
  purchaseYear: number;
  title: string;
  description: string;
  price: number;
  location: {
    state: string;
    district: string;
    address: string;
  };
  images: string[];
}

export async function createListing(params: CreateListingParams) {
  try {
    await dbConnect();
    const userProfile = await getAuthenticatedUserProfile();
    if (!userProfile) {
      throw new Error('You must be logged in to create a listing.');
    }

    const newListing = new Listing({
      ...params,
      variant: {
        ram: params.ram,
        storage: params.storage,
        color: '', // Color is not in the form yet
      },
      seller: userProfile._id,
    });

    await newListing.save();
    revalidatePath('/my-listings');
    return JSON.parse(JSON.stringify(newListing));
  } catch (error) {
    console.error('Error creating listing:', error);
    throw new Error('Failed to create listing.');
  }
}

export async function getListings(filters: SearchParams): Promise<ListingType[]> {
  try {
    await dbConnect();

    const query: any = {};
    if (filters.q) {
      query.$or = [
        { title: { $regex: filters.q, $options: 'i' } },
        { brand: { $regex: filters.q, $options: 'i' } },
        { model: { $regex: filters.q, $options: 'i' } },
      ];
    }
    if (filters.brand && filters.brand !== 'all') query.brand = { $regex: `^${filters.brand}$`, $options: 'i' };
    if (filters.condition && filters.condition !== 'all') query.condition = filters.condition;
    if (filters.district && filters.district !== 'all') query['location.district'] = filters.district;
    if (filters.ram) query['variant.ram'] = Number(filters.ram);
    if (filters.storage) query['variant.storage'] = Number(filters.storage);
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }
     if (filters.sellerId) {
      query.seller = filters.sellerId;
    }

    const listings = await Listing.find(query)
      .populate({ path: 'seller', model: User, select: 'name avatar uid' })
      .sort({ createdAt: -1 })
      .limit(filters.limit || 20)
      .lean();
    
    return JSON.parse(JSON.stringify(listings)).map((listing: any) => ({
      ...listing,
      id: listing._id.toString(),
      seller: {
        ...listing.seller,
        id: listing.seller.uid,
        _id: listing.seller._id.toString(),
      },
    }));
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export async function getListingById(id: string): Promise<ListingType | null> {
  try {
    await dbConnect();
    const listing = await Listing.findById(id)
      .populate({ path: 'seller', model: User, select: 'name avatar uid rating reviews isVerified' }) // Add rating, reviews etc.
      .lean();

    if (!listing) return null;

     // Mock data for seller rating for now
    const sellerWithMockData = {
        ...listing.seller,
        rating: 4.8,
        reviews: 124,
        isVerified: true
    }

    return JSON.parse(JSON.stringify({
      ...listing,
      id: listing._id.toString(),
      seller: {
        ...sellerWithMockData,
        id: listing.seller.uid,
        _id: listing.seller._id.toString(),
      }
    }));
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

export async function getMyListings() {
   try {
    const userProfile = await getAuthenticatedUserProfile();
    if (!userProfile) {
      return { activeListings: [], soldListings: [], flaggedListings: [] };
    }
    
    const allMyListings = await getListings({ sellerId: userProfile._id.toString() });

    const activeListings = allMyListings.filter(l => l.status === 'active');
    const soldListings = allMyListings.filter(l => l.status === 'sold');
    const flaggedListings = allMyListings.filter(l => l.status === 'flagged');

    return { activeListings, soldListings, flaggedListings };

   } catch (error) {
     console.error('Error fetching my listings:', error);
     return { activeListings: [], soldListings: [], flaggedListings: [] };
   }
}

type UpdateListingData = Omit<CreateListingParams, 'images'>;

export async function updateListing(id: string, data: UpdateListingData) {
  try {
    await dbConnect();
    const userProfile = await getAuthenticatedUserProfile();
    if (!userProfile) {
      throw new Error('You must be logged in to update a listing.');
    }

    const listing = await Listing.findById(id);

    if (!listing || listing.seller.toString() !== userProfile._id.toString()) {
      throw new Error('Listing not found or you do not have permission to edit it.');
    }

    const updatePayload = {
      ...data,
      variant: {
        ram: data.ram,
        storage: data.storage,
        color: listing.variant.color, // Preserve existing color
      }
    };
    
    // These are now nested in variant, so remove from top level
    delete (updatePayload as any).ram;
    delete (updatePayload as any).storage;

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    );
    
    if (!updatedListing) {
        throw new Error('Failed to update listing in database');
    }

    revalidatePath(`/listings/${id}`);
    revalidatePath(`/my-listings/${id}/edit`);
    revalidatePath('/my-listings');
  } catch (error) {
    console.error('Error updating listing:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to update listing: ${error.message}`);
    }
    throw new Error('An unknown error occurred while updating the listing.');
  }
}
