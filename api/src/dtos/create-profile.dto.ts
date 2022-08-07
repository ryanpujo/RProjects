import { Address } from '../models/User';

export class CreateProfileDto {
  name?: string;
  gender?: string;
  picture?: string;
  addresses?: Address[];
}
