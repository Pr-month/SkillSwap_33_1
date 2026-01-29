"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersWithSkills = void 0;
const test_users_1 = require("./test_users");
const test_skills_1 = __importDefault(require("./test_skills"));
exports.usersWithSkills = [
    {
        ...test_users_1.users[0],
        skills: [test_skills_1.default[0], test_skills_1.default[3]],
        favoriteSkills: [test_skills_1.default[1]],
    },
    {
        ...test_users_1.users[1],
        skills: [test_skills_1.default[1]],
        favoriteSkills: [test_skills_1.default[3]],
    },
    {
        ...test_users_1.users[2],
        skills: [test_skills_1.default[2]],
        favoriteSkills: [test_skills_1.default[4]],
    },
    {
        ...test_users_1.users[3],
        skills: [test_skills_1.default[4]],
        favoriteSkills: [test_skills_1.default[2]],
    },
];
//# sourceMappingURL=test_users_with_skills.js.map