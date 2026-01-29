"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGateway = void 0;
const common_1 = require("@nestjs/common");
class BaseGateway {
    wsGuard;
    logger = new common_1.Logger('ws');
    constructor(wsGuard) {
        this.wsGuard = wsGuard;
    }
    async handleConnection(client) {
        try {
            const authenticatedClient = await this.wsGuard.verify(client);
            await authenticatedClient.join(authenticatedClient.data.user.sub);
        }
        catch (e) {
            this.logger.warn(e.message);
            client.disconnect();
        }
    }
}
exports.BaseGateway = BaseGateway;
//# sourceMappingURL=base.gateway.js.map