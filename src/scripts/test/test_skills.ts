import { Category } from '../../categories/entities/category.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { User } from '../../users/entities/user.entity';

const skills: Skill[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
    title: 'React разработка',
    description:
      'Разработка SPA-приложений на React с использованием TypeScript',
    category: {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Веб-разработка',
    } as Category,
    images: [
      'https://example.com/skills/react1.png',
      'https://example.com/skills/react2.jpg',
    ],
    owner: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Александр Иванов',
    } as User,
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-03-20T14:45:00Z'),
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567892',
    title: 'Figma прототипирование',
    description: 'Создание интерактивных прототипов в Figma',
    category: {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'UI/UX дизайн',
    } as Category,
    images: ['https://example.com/skills/figma1.png'],
    owner: {
      id: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Мария Петрова',
    } as User,
    createdAt: new Date('2024-02-10T09:15:00Z'),
    updatedAt: new Date('2024-02-10T09:15:00Z'),
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567893',
    title: 'Разговорный английский',
    description: 'Помощь в улучшении разговорных навыков английского языка',
    category: {
      id: '550e8400-e29b-41d4-a716-446655440007',
      name: 'Английский язык',
    } as Category,
    images: [],
    owner: {
      id: '123e4567-e89b-12d3-a456-426614174003',
      name: 'Иван Сидоров',
    } as User,
    createdAt: new Date('2024-03-05T16:20:00Z'),
    updatedAt: new Date('2024-03-25T11:10:00Z'),
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567894',
    title: 'Flutter разработка',
    description: 'Создание кроссплатформенных мобильных приложений',
    category: {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Мобильная разработка',
    } as Category,
    images: [
      'https://example.com/skills/flutter1.jpg',
      'https://example.com/skills/flutter2.png',
      'https://example.com/skills/flutter3.jpg',
    ],
    owner: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Александр Иванов',
    } as User,
    createdAt: new Date('2024-04-01T12:00:00Z'),
    updatedAt: new Date('2024-04-01T12:00:00Z'),
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567895',
    title: 'Адаптивная верстка',
    description: '',
    category: {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Веб-разработка',
    } as Category,
    images: [],
    owner: {
      id: '123e4567-e89b-12d3-a456-426614174004',
      name: 'Елена Козлова',
    } as User,
    createdAt: new Date('2024-04-10T08:45:00Z'),
    updatedAt: new Date('2024-04-12T13:30:00Z'),
  },
];

export default skills;
