"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_categories_1 = __importDefault(require("./test_categories"));
const test_users_1 = require("./test_users");
const skills = [
    {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
        title: 'React разработка',
        description: 'Разработка SPA-приложений на React с использованием TypeScript',
        category: test_categories_1.default[1],
        images: [
            'https://example.com/skills/react1.png',
            'https://example.com/skills/react2.jpg',
        ],
        owner: test_users_1.users[0],
        createdAt: new Date('2024-01-15T10:30:00Z'),
        updatedAt: new Date('2024-03-20T14:45:00Z'),
    },
    {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567892',
        title: 'Figma прототипирование',
        description: 'Создание интерактивных прототипов в Figma',
        category: test_categories_1.default[4],
        images: ['https://example.com/skills/figma1.png'],
        owner: test_users_1.users[1],
        createdAt: new Date('2024-02-10T09:15:00Z'),
        updatedAt: new Date('2024-02-10T09:15:00Z'),
    },
    {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567893',
        title: 'Разговорный английский',
        description: 'Помощь в улучшении разговорных навыков английского языка',
        category: test_categories_1.default[6],
        images: [],
        owner: test_users_1.users[2],
        createdAt: new Date('2024-03-05T16:20:00Z'),
        updatedAt: new Date('2024-03-25T11:10:00Z'),
    },
    {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567894',
        title: 'Flutter разработка',
        description: 'Создание кроссплатформенных мобильных приложений',
        category: test_categories_1.default[2],
        images: [
            'https://example.com/skills/flutter1.jpg',
            'https://example.com/skills/flutter2.png',
            'https://example.com/skills/flutter3.jpg',
        ],
        owner: test_users_1.users[0],
        createdAt: new Date('2024-04-01T12:00:00Z'),
        updatedAt: new Date('2024-04-01T12:00:00Z'),
    },
    {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567895',
        title: 'Адаптивная верстка',
        description: '',
        category: test_categories_1.default[1],
        images: [],
        owner: test_users_1.users[3],
        createdAt: new Date('2024-04-10T08:45:00Z'),
        updatedAt: new Date('2024-04-12T13:30:00Z'),
    },
];
exports.default = skills;
//# sourceMappingURL=test_skills.js.map