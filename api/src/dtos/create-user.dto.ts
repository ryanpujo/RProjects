import { Max, Min, ValidateIf } from 'class-validator';
import { EmporiumDocument } from '../models/emporium.model';
import User, { Profile, Role } from '../models/User';

export class CreateUserDto {
  @Min(4, { message: 'username is too short' })
  @Max(12, { message: 'username is too long' })
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
  createdAt?: number;
  lastLoginAt?: number;
  profile?: Profile;
  emporium?: EmporiumDocument;
}
