"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ids = [
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440007',
];
const categories = [
    {
        id: ids[0],
        name: 'Программирование',
        parent: null,
        children: [
            {
                id: ids[1],
            },
            {
                id: ids[2],
            },
        ],
    },
    {
        id: ids[1],
        name: 'Веб-разработка',
        parent: { id: ids[0] },
        children: [],
    },
    {
        id: ids[2],
        name: 'Мобильная разработка',
        parent: { id: ids[0] },
        children: [],
    },
    {
        id: ids[3],
        name: 'Дизайн',
        parent: null,
        children: [{ id: ids[4] }],
    },
    {
        id: ids[4],
        name: 'UI/UX дизайн',
        parent: { id: ids[3] },
        children: [],
    },
    {
        id: ids[5],
        name: 'Языки',
        parent: null,
        children: [{ id: ids[6] }],
    },
    {
        id: ids[6],
        name: 'Английский язык',
        parent: { id: ids[5] },
        children: [],
    },
];
exports.default = categories;
//# sourceMappingURL=test_categories.js.map