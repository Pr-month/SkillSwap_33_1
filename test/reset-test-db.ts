import { DataSource } from 'typeorm';
import { users, usersWithSkills } from './test_users';
import categories from './test_categories';
import skills from './test_skills';
import { User } from '../src/users/entities/user.entity';
import { Category } from '../src/categories/entities/category.entity';
import { Skill } from '../src/skills/entities/skill.entity';
import dataSource from '../src/config/db.config';

async function resetDatabase() {
  try {
    await dataSource.initialize();
    await dataSource.synchronize();
    await saveData(dataSource, Category, categories as Category[]);
    await saveData(dataSource, User, users);
    await saveData(dataSource, Skill, skills);
    await saveData(dataSource, User, usersWithSkills);
  } catch (error) {
    console.error(error);
  }
}

async function saveData<T extends User | Skill | Category>(
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

resetDatabase();
