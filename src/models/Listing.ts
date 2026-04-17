import mongoose, { Schema, Document, models } from 'mongoose';
import type { Listing as ListingType } from '@/lib/types';

// Omit 'id' because MongoDB provides it, and 'seller' will be a different type.
export interface IListing extends Omit<ListingType, 'id' | 'seller'>, Document {
  seller: mongoose.Schema.Types.ObjectId;
}

const ListingSchema: Schema = new Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  variant: {
    ram: { type: Number, required: true },
    storage: { type: Number, required: true },
    color: { type: String },
  },
  price: { type: Number, required: true },
  isNegotiable: { type: Boolean, default: false },
  condition: { type: String, enum: ['new', 'like_new', 'good', 'fair'], required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  location: {
    district: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String },
  },
  purchaseYear: { type: Number },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isBoosted: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  favoriteCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'sold', 'flagged'], default: 'active' },
}, { timestamps: true }); // `createdAt` and `updatedAt`

export default models.Listing || mongoose.model<IListing>('Listing', ListingSchema);
