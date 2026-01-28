"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const requests_service_1 = require("./requests.service");
const create_request_dto_1 = require("./dto/create-request.dto");
const update_request_dto_1 = require("./dto/update-request.dto");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
const requests_swagger_1 = require("./requests.swagger");
let RequestsController = class RequestsController {
    requestsService;
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    create(req, createRequestDto) {
        const senderId = req.user.sub;
        return this.requestsService.create(createRequestDto, senderId);
    }
    findIncoming(req) {
        const userId = req.user.sub;
        return this.requestsService.findIncoming(userId);
    }
    findOutgoing(req) {
        const userId = req.user.sub;
        return this.requestsService.findOutgoing(userId);
    }
    update(req, id, updateRequestDto) {
        const userId = req.user.sub;
        return this.requestsService.update(id, updateRequestDto, userId);
    }
    remove(req, id) {
        const userId = req.user.sub;
        const isAdmin = req.user.role === roles_enum_1.UserRole.ADMIN;
        return this.requestsService.remove(id, userId, isAdmin);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, requests_swagger_1.ApiCreateRequest)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_request_dto_1.CreateRequestDto]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('incoming'),
    (0, requests_swagger_1.ApiGetIncomingRequests)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findIncoming", null);
__decorate([
    (0, common_1.Get)('outgoing'),
    (0, requests_swagger_1.ApiGetOutgoingRequests)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "findOutgoing", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, requests_swagger_1.ApiUpdateRequest)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_request_dto_1.UpdateRequestDto]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, requests_swagger_1.ApiDeleteRequest)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "remove", null);
exports.RequestsController = RequestsController = __decorate([
    (0, swagger_1.ApiTags)('requests'),
    (0, common_1.Controller)('requests'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.UserRole.USER, roles_enum_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map