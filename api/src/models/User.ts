import { compare, genSalt, hash } from 'bcrypt';
import mongoose, { Document, model, Schema } from 'mongoose';
import { nanoid } from 'nanoid';
import { EmporiumDocument } from './emporium.model';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
export type Address = {
  _id: string;
  country: string;
  city: string;
  zipCode: number;
  fullAddress: string;
};
export type Profile = {
  name: string;
  gender: string;
  picture: string;
};
export type UserDocument = Document & {
  username: string;
  email: string;
  password: string;
  following: string[];
  role: Role;
  createdAt: number;
  lastLoginAt: number;
  profile: Profile;
  addresses: Address[];
  isAlsoSeller: boolean;
  emporiumId: EmporiumDocument;
  comparePassword: ComparePasswordFunction;
};
type ComparePasswordFunction = (
  plainPassword: string,
  cb: (err: any, isMatch: boolean) => void,
) => void;
const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EmporiumSchema' }],
  role: { type: String, enum: Role, default: Role.USER },
  createdAt: { type: Number, required: true },
  lastLoginAt: { type: Number },
  isAlsoSeller: { type: Boolean },
  profile: {
    name: String,
    gender: String,
    picture: String,
  },
  addresses: [
    {
      _id: { type: String, default: nanoid() },
      country: String,
      city: String,
      zipCode: Number,
      fullAddress: String,
    },
  ],
  emporiumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Emporium' },
});

UserSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  genSalt(10, (err, salt) => {
    if (err) {
      next(err);
    }
    hash(user.password, salt, (err, hash) => {
      if (err) {
        next(err);
      }
      user.password = hash;
      next();
    });
  });
});

const comparePassword: ComparePasswordFunction = function (
  this: any,
  plainPassword,
  cb,
) {
  compare(plainPassword, this.password, (err, isMatch: boolean) => {
    cb(err, isMatch);
  });
};
UserSchema.methods.comparePassword = comparePassword;
export default model<UserDocument>('User', UserSchema);
export const registerModels = () => {
  try {
    mongoose.model('User', UserSchema);
  } catch (error) {
    // console.log(error)
  }
};
