import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  //   JoinTable,
  //   ManyToMany,
} from 'typeorm';
import { Length, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { Gender } from '../users.enums';
import { Skill } from '../../skills/entities/skill.entity';
import { UserRole } from '../../auth/roles.enum';

// import { Skill } from 'src/skills/entities/skill.entity';
// import { Category } from 'src/categories/entities/category.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  @Length(2, 50, { message: 'Ваше имя должно быть от 2 до 50 символов' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @Length(0, 1000, {
    message: 'Информация о себе не должна превышать 1000 символов',
  })
  about?: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Неверный формат даты рождения' })
  birthdate?: Date;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  city?: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  gender?: Gender;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  avatar?: string;

  @OneToMany(() => Skill, (skill) => skill.owner)
  skills: Skill[];

  //   @ManyToMany(() => Category, (category) => category.learners)
  //   @JoinTable()
  //   wantToLearn: Category[];

  //   @ManyToMany(() => Skill)
  //   @JoinTable()
  //   favoriteSkills: Skill[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'text', nullable: true, default: null })
  refreshToken?: string | null;
}
