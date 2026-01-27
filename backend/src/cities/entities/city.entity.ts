import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  @Index('IDX_CITY_POPULATION')
  population: number;
}
