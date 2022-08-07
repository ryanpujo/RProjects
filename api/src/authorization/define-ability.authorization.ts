import { Ability, AbilityBuilder } from '@casl/ability';
import { UserDocument } from '../models/User';

export default (user: UserDocument) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);
  can('Read', 'Product');
  can('Read', 'Emporium');
};
