import mongoose, { Document, model, Schema } from 'mongoose';
import { Address, UserDocument } from './User';

export type EmporiumDocument = Document & {
  name: string;
  addresses: Address[];
  email: string;
  rating: number;
  description: string;
  followers: UserDocument[];
  notes: string;
  joinAt: number;
};
const EmporiumSchema = new Schema<EmporiumDocument>({
  name: { type: String, unique: true },
  addresses: [
    {
      _id: { type: String },
      country: String,
      city: String,
      zipCode: Number,
      fullAddress: String,
    },
  ],
  email: String,
  rating: { type: Number, default: 0 },
  description: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema' }],
  notes: String,
  joinAt: { type: Number },
});

export default model<EmporiumDocument>('Emporium', EmporiumSchema);
