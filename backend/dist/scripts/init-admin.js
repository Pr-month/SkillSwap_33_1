"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_enum_1 = require("../auth/roles.enum");
const db_config_1 = __importDefault(require("../config/db.config"));
const user_entity_1 = require("../users/entities/user.entity");
async function initAdmin() {
    await db_config_1.default.initialize();
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password)
        throw new Error('Пароль или эмейл админа не предоставлен');
    const repository = db_config_1.default.getRepository(user_entity_1.User);
    return await repository.save({ email, password, role: roles_enum_1.UserRole.ADMIN });
}
initAdmin().catch((e) => console.error(e));
//# sourceMappingURL=init-admin.js.map