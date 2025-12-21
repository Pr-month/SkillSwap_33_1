import { Gender } from '../users.enums';
import { UserRole } from '../../auth/roles.enum';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  about?: string;
  birthdate?: Date;
  city?: string;
  gender?: Gender;
  avatar?: string;
  role: UserRole;
}
