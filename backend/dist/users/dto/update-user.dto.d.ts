import { Gender } from '../users.enums';
export declare class UpdateUserDto {
    name?: string;
    about?: string;
    birthdate?: Date;
    city?: string;
    gender?: Gender;
    avatar?: string;
}
