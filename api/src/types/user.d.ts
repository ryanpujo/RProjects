import { CallbackError } from 'mongoose';

declare namespace UserUtility {
  type MongooseCallback<T = any> = (error: CallbackError, user: T) => void;
}
