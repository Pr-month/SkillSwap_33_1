"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLOSSARY_PROVIDERS = void 0;
const cities_glossary_provider_1 = require("./providers/cities.glossary-provider");
exports.GLOSSARY_PROVIDERS = [
    cities_glossary_provider_1.CitiesGlossaryProvider,
    {
        provide: 'GLOSSARY_PROVIDERS_MAP',
        useFactory: (citiesProvider) => {
            const map = new Map();
            map.set(citiesProvider.code, citiesProvider);
            return map;
        },
        inject: [cities_glossary_provider_1.CitiesGlossaryProvider],
    },
];
//# sourceMappingURL=glossaries.providers.js.map