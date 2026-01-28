"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const roles_enum_1 = require("../../auth/roles.enum");
const users_enums_1 = require("../../users/users.enums");
const bcrypt = __importStar(require("bcrypt"));
const test_cities_1 = require("./test_cities");
exports.users = [
    {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Александр Иванов',
        email: 'alex.ivanov@example.com',
        password: bcrypt.hashSync('12345', parseInt(process.env.HASH_SALT || '10')),
        about: 'Фронтенд разработчик с 5-летним опытом. Люблю React и TypeScript.',
        birthdate: new Date('1990-05-15'),
        city: test_cities_1.cities[0],
        gender: users_enums_1.Gender.MALE,
        avatar: 'https://example.com/avatars/alex.jpg',
        skills: [],
        role: roles_enum_1.UserRole.USER,
        refreshToken: null,
        favoriteSkills: [],
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Мария Петрова',
        email: 'maria.petrova@example.com',
        password: bcrypt.hashSync('1111', parseInt(process.env.HASH_SALT || '10')),
        about: 'UI/UX дизайнер. Создаю удобные и красивые интерфейсы.',
        birthdate: new Date('1993-08-22'),
        city: test_cities_1.cities[1],
        gender: users_enums_1.Gender.FEMALE,
        avatar: 'https://example.com/avatars/maria.jpg',
        skills: [],
        role: roles_enum_1.UserRole.USER,
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        favoriteSkills: [],
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174003',
        name: 'Иван Сидоров',
        email: 'ivan.sidorov@example.com',
        password: bcrypt.hashSync('strong_password', parseInt(process.env.HASH_SALT || '10')),
        about: 'Преподаватель английского языка. Опыт работы - 7 лет.',
        birthdate: new Date('1988-11-30'),
        city: test_cities_1.cities[3],
        gender: users_enums_1.Gender.MALE,
        avatar: '',
        skills: [],
        role: roles_enum_1.UserRole.ADMIN,
        refreshToken: null,
        favoriteSkills: [],
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174004',
        name: 'Елена Козлова',
        email: 'elena.kozlova@example.com',
        password: bcrypt.hashSync('awesome_password', parseInt(process.env.HASH_SALT || '10')),
        about: '',
        birthdate: new Date('1988-11-30'),
        city: test_cities_1.cities[2],
        gender: users_enums_1.Gender.FEMALE,
        avatar: 'https://example.com/avatars/elena.jpg',
        skills: [],
        role: roles_enum_1.UserRole.USER,
        refreshToken: null,
        favoriteSkills: [],
    },
];
//# sourceMappingURL=test_users.js.map