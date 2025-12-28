import { Category } from '../src/categories/entities/category.entity';

export type CategoryLike = Omit<Category, 'parent' | 'children'> & {
  parent: Pick<Category, 'id'> | null;
  children: Pick<Category, 'id'>[];
};

const categories: CategoryLike[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Программирование',
    parent: null,
    children: [
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
      },
    ],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Веб-разработка',
    parent: { id: '550e8400-e29b-41d4-a716-446655440001' },
    children: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Мобильная разработка',
    parent: { id: '550e8400-e29b-41d4-a716-446655440001' },
    children: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Дизайн',
    parent: null,
    children: [{ id: '550e8400-e29b-41d4-a716-446655440006' }],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'UI/UX дизайн',
    parent: { id: '550e8400-e29b-41d4-a716-446655440002' },
    children: [],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Языки',
    parent: null,
    children: [{ id: '550e8400-e29b-41d4-a716-446655440003' }],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Английский язык',
    parent: { id: '550e8400-e29b-41d4-a716-446655440003' },
    children: [],
  },
];

export default categories;
