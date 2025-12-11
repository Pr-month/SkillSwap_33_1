import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Length, IsEmail, IsOptional, IsDateString } from 'class-validator';

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
  @Length(0, 500, {
    message: 'Информация о себе не должна превышать 500 символов',
  })
  about: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Неверный формат даты рождения' })
  birthdate: Date;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  city: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  gender: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  avatar: string;

  @ManyToMany(() => Skill, skill => skill.owners, { eager: true })
  @JoinTable()
  skills: Skill[];

  @ManyToMany(() => Category, category => category.learners, { eager: true })
  @JoinTable()
  wantToLearn: Category[];

  @ManyToMany(() => Skill, { eager: true })
  @JoinTable()
  favoriteSkills: Skill[];

  @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' })
  role: 'USER' | 'ADMIN';

  @Column({ type: 'text', nullable: true })
  refreshToken: string;
}
