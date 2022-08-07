import { Router } from 'express';
import { join } from 'path';
import { isAuthenticated } from '../config/passport';
import {
  addAddress,
  deleteAccount,
  deleteAddress,
  findUser,
  findUsers,
  getProfilePicture,
  login,
  logout,
  register,
  updateUserProfile,
} from '../controllers/user';
import { uploadPicture } from '../middleware/uploadFile.middleware';
const pictureField = uploadPicture({
  destination: join(process.cwd(), `public/uploads/images/profile`),
  limits: { fileSize: 2 * 1024 * 1024 },
}).single('avatar');
const route: Router = Router();
route.post('/login', login);
route.post('/', register);
route.post('/logout', isAuthenticated, logout);
route.post('/add-address', isAuthenticated, addAddress);
route.get('/', isAuthenticated, findUser);
route.get('/all', findUsers);
route.get('/profile-picture/:picture', isAuthenticated, getProfilePicture);
route.patch(
  '/update-profile/',
  isAuthenticated,
  pictureField,
  updateUserProfile,
);
route.delete('/', isAuthenticated, deleteAccount);
route.delete('/:id', isAuthenticated, deleteAddress);
export default route;
