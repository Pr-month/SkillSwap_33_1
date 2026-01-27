import { DataSource } from 'typeorm';
import { users } from './test_users';
import categories from './test_categories';
import skills from './test_skills';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Skill } from '../../skills/entities/skill.entity';
import dataSource from '../../config/db.config';
import { City } from 'src/cities/entities/city.entity';
import { cities } from './test_cities';
import { usersWithSkills } from './test_users_with_skills';

async function resetDatabase() {
  await dataSource.initialize();
  await dataSource.synchronize();
  await saveData(dataSource, City, cities);
  await saveData(dataSource, Category, categories as Category[]);
  await saveData(dataSource, User, users);
  await saveData(dataSource, Skill, skills);
  await saveData(dataSource, User, usersWithSkills);
}

async function saveData<T extends User | Skill | Category | City>(
  dataSource: DataSource,
  entity: new () => T,
  data: T[],
) {
  const repository = dataSource.getRepository(entity);

  for (const item of data) {
    await repository.save(item);
  }

  return;
}

resetDatabase().catch((err) => console.error(err));
