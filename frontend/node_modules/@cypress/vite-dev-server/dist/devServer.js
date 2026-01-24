"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devServer = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const major_1 = tslib_1.__importDefault(require("semver/functions/major"));
const getVite_1 = require("./getVite");
const resolveConfig_1 = require("./resolveConfig");
const debug = (0, debug_1.default)('cypress:vite-dev-server:devServer');
const ALL_FRAMEWORKS = ['react', 'vue'];
async function devServer(config) {
    // This has to be the first thing we do as we need to source vite from their project's dependencies
    const vite = (0, getVite_1.getVite)(config);
    let majorVersion = undefined;
    if (vite.version) {
        majorVersion = (0, major_1.default)(vite.version);
        debug(`Found vite version v${majorVersion}`);
    }
    else {
        debug(`vite version not found`);
    }
    debug('Creating Vite Server');
    const server = await devServer.create(config, vite);
    debug('Vite server created');
    await server.listen();
    const { port } = server.config.server;
    if (!port) {
        throw new Error('Missing vite dev server port.');
    }
    debug('Successfully launched the vite server on port', port);
    return {
        port,
        // Close is for unit testing only. We kill this child process which will handle the closing of the server
        close(cb) {
            debug('closing dev server');
            return server.close().then(() => {
                debug('closed dev server');
                cb === null || cb === void 0 ? void 0 : cb();
            }).catch(cb);
        },
    };
}
exports.devServer = devServer;
devServer.create = async function createDevServer(devServerConfig, vite) {
    try {
        const config = await (0, resolveConfig_1.createViteDevServerConfig)(devServerConfig, vite);
        return await vite.createServer(config);
    }
    catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(err);
    }
};
