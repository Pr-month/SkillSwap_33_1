import { Gender } from '../users.enums';
import { Skill } from '../../skills/entities/skill.entity';
import { UserRole } from '../../auth/roles.enum';
import { City } from 'src/cities/entities/city.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    about: string;
    birthdate: Date;
    city: City;
    gender: Gender;
    avatar: string;
    skills: Skill[];
    favoriteSkills: Skill[];
    role: UserRole;
    refreshToken: string | null;
}
