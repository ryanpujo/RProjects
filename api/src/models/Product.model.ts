import { Document, model, Schema } from 'mongoose';
import { EmporiumDocument } from './emporium.model';

export type ProductDocument = Document & {
  name: string;
  emporiumId: EmporiumDocument;
  categories: string[];
  pictures: string[];
  description: string;
  manufacture: string;
  dimension: any;
  price: number;
  stock: number;
  discount: number;
  sold: number;
  createdAt: number;
};

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, require: true },
  emporiumId: { type: Schema.Types.ObjectId, ref: 'Emporium' },
  pictures: [{ type: String }],
  categories: [{ type: String }],
  description: { type: String },
  manufacture: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  discount: { type: Number },
  sold: { type: Number, default: 0 },
  createdAt: { type: Number },
});
export default model<ProductDocument>('Product', ProductSchema);
