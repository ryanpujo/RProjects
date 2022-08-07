import mongoose from 'mongoose';
import { MONGO_URI } from '../utils/config.util';
import { isUserExist } from './user.service';

describe('test if user by certain criteria exist', () => {
  beforeEach(function (done) {
    mongoose.connect(MONGO_URI, { dbName: 'test' });
    mongoose.connection.once('connected', () => {
      // This is the right model because ^registerModels set it up for us.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      done();
    });
  });

  test('it shpuld return true cause user by certain username is exist', async () => {
    const result = await isUserExist({ username: 'starlight' });
    expect(result).toBeTruthy();
  });
  test('it should return false cause user by certain username doesn not exist', async () => {
    const result = await isUserExist({ username: 'iwdnankakld' });
    expect(result).toBeFalsy();
  });
  test('it shpuld return true cause user by certain email is exist', async () => {
    const result = await isUserExist({ email: 'starlight@gmail.com' });
    expect(result).toBeTruthy();
  });
  test('it should return false cause user by certain username doesn not exist', async () => {
    const result = await isUserExist({ email: 'iwdnankakld@gmail.com' });
    expect(result).toBeFalsy();
  });
  afterEach((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.disconnect();
    done();
  });
});
