import { Document, Model } from 'mongoose';

export async function createAddress<T = Document>(
  id: string,
  address: any,
  document: Model<T>,
) {
  const result = await document.updateOne(
    { _id: id },
    { $push: { addresses: address } },
  );
  return result;
}
