import { User } from 'src/users/entities/user.entity';
import { users } from './test_users';
import skills from './test_skills';

export const usersWithSkills: User[] = [
  {
    ...users[0],
    skills: [skills[0], skills[3]],
    favoriteSkills: [skills[1]],
  },
  {
    ...users[1],
    skills: [skills[1]],
    favoriteSkills: [skills[3]],
  },
  {
    ...users[2],
    skills: [skills[2]],
    favoriteSkills: [skills[4]],
  },
  {
    ...users[3],
    skills: [skills[4]],
    favoriteSkills: [skills[2]],
  },
];
