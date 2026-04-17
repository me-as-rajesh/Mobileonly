
'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedUserProfile } from './user.actions';
import type { Listing as ListingType, SearchParams } from '@/lib/types';
import { adminApp } from '@/firebase/admin';
import { getDatabase } from 'firebase-admin/database';

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
  if (!adminApp) {
    throw new Error("Firebase Admin SDK not initialized. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is likely missing on the server.");
  }
  try {
    const userProfile = await getAuthenticatedUserProfile();
    if (!userProfile) {
      throw new Error('You must be logged in to create a listing.');
    }

    const db = getDatabase(adminApp);
    const listingsRef = db.ref('listings');
    const newListingsRef = listingsRef.push();
    
    const newListingData = {
      ...params,
      variant: {
        ram: params.ram,
        storage: params.storage,
        color: '', // Color is not in the form yet
      },
      seller: userProfile.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      isBoosted: false,
      viewCount: 0,
      favoriteCount: 0,
      isNegotiable: false, // Default value
    };

    await newListingsRef.set(newListingData);
    const listingId = newListingsRef.key;

    // Add to user-listings index
    if (listingId) {
      const userListingsRef = db.ref(`user-listings/${userProfile.uid}/${listingId}`);
      await userListingsRef.set(true);
    }

    revalidatePath('/my-listings');
    return { ...newListingData, id: listingId };
  } catch (error) {
    console.error('Error creating listing:', error);
    throw new Error('Failed to create listing.');
  }
}

export async function getListings(filters: SearchParams): Promise<ListingType[]> {
  if (!adminApp) {
    console.warn("Firebase Admin SDK not initialized. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is likely missing on the server. Returning empty list for getListings to allow build to pass.");
    return [];
  }
  try {
    const db = getDatabase(adminApp);
    const listingsRef = db.ref('listings');
    const snapshot = await listingsRef.once('value');
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const listingsData = snapshot.val();
    
    let allListings: ListingType[] = Object.keys(listingsData).map(id => ({
      id,
      ...listingsData[id],
    }));

    // Apply filters in memory
    if (filters.q) {
      const q = filters.q.toLowerCase();
      allListings = allListings.filter(l => 
        l.title.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q) ||
        l.model.toLowerCase().includes(q)
      );
    }
    if (filters.brand && filters.brand !== 'all') allListings = allListings.filter(l => l.brand.toLowerCase() === filters.brand?.toLowerCase());
    if (filters.condition && filters.condition !== 'all') allListings = allListings.filter(l => l.condition === filters.condition);
    if (filters.district && filters.district !== 'all') allListings = allListings.filter(l => l.location.district === filters.district);
    if (filters.ram) allListings = allListings.filter(l => l.variant.ram === Number(filters.ram));
    if (filters.storage) allListings = allListings.filter(l => l.variant.storage === Number(filters.storage));
    if (filters.minPrice) allListings = allListings.filter(l => l.price >= Number(filters.minPrice));
    if (filters.maxPrice) allListings = allListings.filter(l => l.price <= Number(filters.maxPrice));
    if (filters.sellerId) allListings = allListings.filter(l => l.seller === filters.sellerId);

    // Sort by creation date descending
    allListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Limit results
    if (filters.limit) {
      allListings = allListings.slice(0, filters.limit);
    }

    // Fetch seller data for the filtered listings
    const sellerIds = [...new Set(allListings.map(l => l.seller))];
    const sellerPromises = sellerIds.map(uid => db.ref(`users/${uid}`).once('value'));
    const sellerSnapshots = await Promise.all(sellerPromises);
    
    const sellers: { [key: string]: any } = {};
    sellerSnapshots.forEach(snap => {
      if (snap.exists()) {
        sellers[snap.key!] = snap.val();
      }
    });

    const populatedListings = allListings.map(listing => {
        const sellerData = sellers[listing.seller as any];
        return {
            ...listing,
            seller: {
                id: listing.seller as string,
                uid: listing.seller as string,
                name: sellerData?.name || 'Unknown Seller',
                avatar: sellerData?.avatar || '',
                // Mocking rating data as it's not in the user model
                rating: 4.8, 
                reviews: 124,
                isVerified: true,
            }
        };
    });

    return JSON.parse(JSON.stringify(populatedListings));
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export async function getListingById(id: string): Promise<ListingType | null> {
  if (!adminApp) {
    console.warn("Firebase Admin SDK not initialized. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is likely missing on the server. Returning null for getListingById to allow build to pass.");
    return null;
  }
  try {
    const db = getDatabase(adminApp);
    const listingRef = db.ref(`listings/${id}`);
    const snapshot = await listingRef.once('value');

    if (!snapshot.exists()) {
      return null;
    }
    
    const listingData = snapshot.val();
    const sellerId = listingData.seller;
    
    const userRef = db.ref(`users/${sellerId}`);
    const userSnapshot = await userRef.once('value');
    
    if (!userSnapshot.exists()) {
      return null; // Or handle as a listing with a missing seller
    }

    const sellerData = userSnapshot.val();

    const listing: ListingType = {
        ...listingData,
        id,
        seller: {
            id: sellerId,
            name: sellerData.name,
            avatar: sellerData.avatar,
            // Mock data for seller rating for now
            rating: 4.8,
            reviews: 124,
            isVerified: true
        }
    };

    return JSON.parse(JSON.stringify(listing));
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

export async function getMyListings() {
   if (!adminApp) {
    console.warn("Firebase Admin SDK not initialized. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is likely missing on the server. Returning empty lists for getMyListings to allow build to pass.");
    return { activeListings: [], soldListings: [], flaggedListings: [] };
   }
   try {
    const userProfile = await getAuthenticatedUserProfile();
    if (!userProfile) {
      return { activeListings: [], soldListings: [], flaggedListings: [] };
    }
    
    const allMyListings = await getListings({ sellerId: userProfile.uid });

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
   if (!adminApp) {
    throw new Error("Firebase Admin SDK not initialized. The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is likely missing on the server.");
  }
  try {
    const userProfile = await getAuthenticatedUserProfile();
    if (!userProfile) {
      throw new Error('You must be logged in to update a listing.');
    }

    const db = getDatabase(adminApp);
    const listingRef = db.ref(`listings/${id}`);
    const snapshot = await listingRef.once('value');

    if (!snapshot.exists() || snapshot.val().seller !== userProfile.uid) {
      throw new Error('Listing not found or you do not have permission to edit it.');
    }

    const updatePayload = {
      ...data,
      variant: {
        ram: data.ram,
        storage: data.storage,
        color: snapshot.val().variant.color, // Preserve existing color
      },
      updatedAt: new Date().toISOString(),
    };
    
    await listingRef.update(updatePayload);

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
