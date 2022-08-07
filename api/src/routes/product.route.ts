import { Router } from 'express';
import { join } from 'path';
import { isAuthenticated } from '../config/passport';
import {
  createProduct,
  deleteProduct,
  findSingleProducrById,
  getProductPictures,
  listAllProducts,
  updateProduct,
} from '../controllers/product.controller';
import { uploadPicture } from '../middleware/uploadFile.middleware';
const picturesField = uploadPicture({
  destination: join(process.cwd(), `public/uploads/images/products`),
  limits: { fileSize: 2 * 1024 * 1024 },
}).array('pictures', 100);
const productRoute: Router = Router();
productRoute.post('/', isAuthenticated, picturesField, createProduct);
productRoute.get('/', listAllProducts);
productRoute.get('/:id', isAuthenticated, findSingleProducrById);
productRoute.get('/products-picture/:picture', getProductPictures);
productRoute.patch('/:id', isAuthenticated, updateProduct);
productRoute.delete('/:id', isAuthenticated, deleteProduct);
export default productRoute;
