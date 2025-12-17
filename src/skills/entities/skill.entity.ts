import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('text', { array: true, default: [] })
  images: string[];

  //Пользователь создавший навык
  //TODO: добавить линк ManyToOne на users/entity
  @Column()
  owner: string;
}
