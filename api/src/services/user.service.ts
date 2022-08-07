import User, { UserDocument } from '../models/User';
import { BadRequest } from '../types/error.type';
import { UserUtility } from '../types/user';

export const isUserExist = async (query: any): Promise<boolean> => {
  const userExist = await User.findOne(query).exec();
  if (userExist) {
    return true;
  }
  return false;
};

export const saveUser = async (
  newUser: any,
  callback: UserUtility.MongooseCallback,
) => {
  const user: UserDocument = new User(newUser);
  const email = newUser.email;
  const username = newUser.username;
  try {
    if (
      (await isUserExist({ email: email })) ||
      (await isUserExist({ username: username }))
    ) {
      throw new BadRequest(
        'there is a user registered under this email or username',
      );
    }
    const newUser: any = await user.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser._doc;
    callback(null, result);
  } catch (error: any) {
    callback(error, null);
  }
};
