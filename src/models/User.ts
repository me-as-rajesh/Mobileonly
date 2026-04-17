import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  uid: string; // Firebase Auth UID
  email: string;
  name: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'both';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['buyer', 'seller', 'both'], required: true },
}, { timestamps: true }); // `createdAt` and `updatedAt`

export default models.User || mongoose.model<IUser>('User', UserSchema);
