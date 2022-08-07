import { Request } from 'express';
import multer, { diskStorage, Multer } from 'multer';
import { nanoid } from 'nanoid';
import { extname } from 'path';
import { BadRequest } from '../types/error.type';
type limits =
  | {
      fieldNameSize?: number | undefined;
      fieldSize?: number | undefined;
      fields?: number | undefined;
      fileSize?: number | undefined;
      files?: number | undefined;
      parts?: number | undefined;
      headerPairs?: number | undefined;
    }
  | undefined;
export const uploadPicture = (option: {
  destination: string;
  limits: limits;
}): Multer => {
  const storage = diskStorage({
    destination: option.destination,
    filename: (req, file, callback) => {
      const ext = extname(file.originalname);
      const now = Date.now();
      const filename = `${now}-${nanoid()}${ext}`;
      return callback(null, filename);
    },
  });
  return multer({
    limits: option.limits,
    fileFilter: (req: Request, file, callback: multer.FileFilterCallback) => {
      const ALLOWED_TYPES = [
        'image/png',
        'image/jpg',
        'image/gif',
        'image/jpeg',
      ];
      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        const err = new BadRequest('use appropriate file extension');
        return callback(err);
      }
      callback(null, true);
    },
    storage,
  });
};
