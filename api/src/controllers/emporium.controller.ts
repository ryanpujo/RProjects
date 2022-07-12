import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import mongoose, { MongooseError } from 'mongoose';
import User, { UserDocument } from '../models/User';
import { BadRequest, NotFound } from '../types/error.type';
import Emporium, { EmporiumDocument } from '../models/emporium.model';

export const createEmporium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await check('email', 'email is not valid').isEmail().run(req);
  await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new BadRequest('complete all required fields');
    return next(error);
  }
  const foundEmail = await Emporium.findOne({ email: req.body.email });
  if (foundEmail) {
    const error = new BadRequest(
      `there is an emporium associated by email ${req.body.email}, please use another email`,
    );
    return next(error);
  }
  const user = req.user as UserDocument;
  User.findById(user.id, (err: MongooseError, user: UserDocument) => {
    if (err) {
      return next(err);
    }
    req.body.joinAt = Date.now();
    const newEmporium = new Emporium(req.body);
    newEmporium.save((err, emporium: EmporiumDocument) => {
      if (err) {
        return next(err);
      }
      user.emporiumId = emporium;
      user.isAlsoSeller = true;
      user.save((err) => {
        if (err) {
          return next(err);
        }
      });
      res.cookie('csrf', req.csrfToken()).status(201).json(emporium);
    });
  });
};

export const getEmporia = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Emporium.find((err: MongooseError, found: any) => {
    if (err) {
      return next(err);
    }
    res.cookie('csrf', req.csrfToken()).status(200).json(found);
  });
};

export const getOwnedEmporium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.user as UserDocument;
  try {
    const user = await User.findById(currentUser.id).populate('emporiumId');
    if (user && !user.isAlsoSeller) {
      const err = new BadRequest('you are not a seller yet');
      return next(err);
    }
    res.cookie('csrf', req.csrfToken()).status(200).json(user?.emporiumId);
  } catch (error) {
    next(error);
  }
};

export const updateEmporium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.user as UserDocument;
  try {
    const user = await User.findById(currentUser.id);
    if (!user) {
      const error = new NotFound('user not found');
      return next(error);
    }
    const updatedEmporium = await Emporium.findByIdAndUpdate(
      user.emporiumId,
      { $set: req.body },
      { new: true },
    );
    res.cookie('csrf', req.csrfToken()).status(200).json(updatedEmporium);
  } catch (error) {
    next(error);
  }
};

export const deleteEmporium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.user as UserDocument;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(currentUser.id);
    if (!user || !user.isAlsoSeller) {
      session.abortTransaction();
      session.endSession();
      const err = new NotFound("user or emporium doesn't exist");
      return next(err);
    }
    await Emporium.findByIdAndDelete(user.emporiumId).session(session);
    await User.findByIdAndUpdate(currentUser.id, {
      $unset: { emporiumId: '' },
      $set: { isAlsoSeller: false },
    });
    await session.commitTransaction();
    session.endSession();
    res.cookie('csrf', req.csrfToken()).status(200).send('emporium deleted');
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
