import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  //TODO: добавить линк OneToMany на categories/entity
  @Column({ type: 'text' })
  category: string;

  //Массив ссылок на изображения
  @Column('text', { array: true, default: [] })
  images: string[];

  //Пользователь создавший навык
  //TODO: добавить линк ManyToOne на users/entity
  @Column()
  owner: string;
}
