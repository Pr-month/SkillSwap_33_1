"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_users_1 = require("./test_users");
const test_categories_1 = __importDefault(require("./test_categories"));
const test_skills_1 = __importDefault(require("./test_skills"));
const user_entity_1 = require("../../users/entities/user.entity");
const category_entity_1 = require("../../categories/entities/category.entity");
const skill_entity_1 = require("../../skills/entities/skill.entity");
const db_config_1 = __importDefault(require("../../config/db.config"));
const city_entity_1 = require("../../cities/entities/city.entity");
const test_cities_1 = require("./test_cities");
const test_users_with_skills_1 = require("./test_users_with_skills");
async function resetDatabase() {
    await db_config_1.default.initialize();
    await db_config_1.default.synchronize();
    await saveData(db_config_1.default, city_entity_1.City, test_cities_1.cities);
    await saveData(db_config_1.default, category_entity_1.Category, test_categories_1.default);
    await saveData(db_config_1.default, user_entity_1.User, test_users_1.users);
    await saveData(db_config_1.default, skill_entity_1.Skill, test_skills_1.default);
    await saveData(db_config_1.default, user_entity_1.User, test_users_with_skills_1.usersWithSkills);
}
async function saveData(dataSource, entity, data) {
    const repository = dataSource.getRepository(entity);
    for (const item of data) {
        await repository.save(item);
    }
    return;
}
resetDatabase().catch((err) => console.error(err));
//# sourceMappingURL=reset-test-db.js.map