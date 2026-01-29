import { UserRole } from 'src/auth/roles.enum';
import dataSource from 'src/config/db.config';
import { User } from 'src/users/entities/user.entity';

async function initAdmin() {
  await dataSource.initialize();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password)
    throw new Error('Пароль или эмейл админа не предоставлен');

  const repository = dataSource.getRepository(User);

  return await repository.save({ email, password, role: UserRole.ADMIN });
}

initAdmin().catch((e) => console.error(e));
