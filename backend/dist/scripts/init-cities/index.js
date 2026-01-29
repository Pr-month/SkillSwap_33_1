"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cities_russia_json_1 = __importDefault(require("./cities-russia.json"));
const db_config_1 = __importDefault(require("../../config/db.config"));
const city_entity_1 = require("../../cities/entities/city.entity");
async function initCities() {
    await db_config_1.default.initialize();
    const cityRepository = db_config_1.default.getRepository(city_entity_1.City);
    await Promise.all(cities_russia_json_1.default.map((city) => cityRepository.save(city)));
}
initCities().catch((e) => console.error(e));
//# sourceMappingURL=index.js.map