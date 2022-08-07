import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

export class Mapper {
  static toUserDto(body: any) {
    const user = new UpdateUserDto();
    if (body.email != undefined) {
      user.email = body.email;
    }
    if (body.emporium != undefined) {
      user.emporium = body.emporium;
    }
    if (body.profile != undefined) {
      user.profile = body.profile;
    }
    if (body.role != undefined) {
      user.role = body.role;
    }
    if (body.username != undefined) {
      user.username = body.username;
    }
    return user;
  }
  static toProfileDto(body: any) {
    const newProfile = new UpdateProfileDto();
    if (body.name != undefined) {
      newProfile.name = body.name;
    }
    if (body.gender != undefined) {
      newProfile.gender = body.gender;
    }
    if (body.picture != undefined) {
      newProfile.picture = body.picture;
    }
    if (body.addresses != undefined) {
      newProfile.addresses = body.addresses;
    }
    return newProfile;
  }
}
