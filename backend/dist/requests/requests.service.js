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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const request_entity_1 = require("./entities/request.entity");
const skill_entity_1 = require("../skills/entities/skill.entity");
const requests_enum_1 = require("./requests.enum");
const notifications_gateway_1 = require("../websocket/gateways/notifications/notifications.gateway");
const types_1 = require("../websocket/gateways/notifications/types");
let RequestsService = class RequestsService {
    requestsRepository;
    skillsRepository;
    notificationsWs;
    constructor(requestsRepository, skillsRepository, notificationsWs) {
        this.requestsRepository = requestsRepository;
        this.skillsRepository = skillsRepository;
        this.notificationsWs = notificationsWs;
    }
    async create(createRequestDto, senderId) {
        const requestedSkill = await this.skillsRepository.findOne({
            where: { id: createRequestDto.requestedSkillId },
            relations: ['owner'],
        });
        if (!requestedSkill) {
            throw new common_1.NotFoundException('Запрашиваемый навык не найден');
        }
        const receiverId = requestedSkill.owner.id;
        if (senderId === receiverId) {
            throw new common_1.BadRequestException('Нельзя отправить заявку самому себе');
        }
        const request = this.requestsRepository.create({
            sender: { id: senderId },
            receiver: { id: receiverId },
            offeredSkill: { id: createRequestDto.offeredSkillId },
            requestedSkill: { id: createRequestDto.requestedSkillId },
        });
        this.notificationsWs.sendNotification(request.receiver.id, {
            type: types_1.NotificationTypes.New,
            createdAt: request.createdAt,
            fromUser: request.sender.name,
        });
        return this.requestsRepository.save(request);
    }
    async findIncoming(userId) {
        return this.requestsRepository.find({
            where: {
                receiver: { id: userId },
                status: (0, typeorm_2.In)([requests_enum_1.RequestStatus.PENDING, requests_enum_1.RequestStatus.IN_PROGRESS]),
            },
            relations: ['sender', 'receiver', 'offeredSkill', 'requestedSkill'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOutgoing(userId) {
        return this.requestsRepository.find({
            where: {
                sender: { id: userId },
                status: (0, typeorm_2.In)([requests_enum_1.RequestStatus.PENDING, requests_enum_1.RequestStatus.IN_PROGRESS]),
            },
            relations: ['sender', 'receiver', 'offeredSkill', 'requestedSkill'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateRequestDto, userId) {
        const request = await this.requestsRepository.findOne({
            where: { id },
            relations: ['receiver'],
        });
        if (!request) {
            throw new common_1.NotFoundException(`Заявка с ID ${id} не найдена`);
        }
        if (request.receiver.id !== userId) {
            throw new common_1.ForbiddenException('Вы можете обновлять только входящие заявки');
        }
        request.status = updateRequestDto.status;
        request.isRead = true;
        let notificationType = null;
        switch (request.status) {
            case requests_enum_1.RequestStatus.ACCEPTED:
                notificationType = types_1.NotificationTypes.Accepted;
                break;
            case requests_enum_1.RequestStatus.REJECTED:
                notificationType = types_1.NotificationTypes.Rejected;
                break;
        }
        if (notificationType) {
            this.notificationsWs.sendNotification(request.sender.id, {
                type: notificationType,
                createdAt: new Date(),
                fromUser: request.receiver.name,
            });
        }
        return this.requestsRepository.save(request);
    }
    async remove(id, userId, isAdmin) {
        const request = await this.requestsRepository.findOne({
            where: { id },
            relations: ['sender'],
        });
        if (!request) {
            throw new common_1.NotFoundException(`Заявка с ID ${id} не найдена`);
        }
        if (!isAdmin && request.sender.id !== userId) {
            throw new common_1.ForbiddenException('Вы можете удалять только свои исходящие заявки');
        }
        await this.requestsRepository.delete(id);
        return { message: 'Заявка успешно удалена' };
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_entity_1.Request)),
    __param(1, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway])
], RequestsService);
//# sourceMappingURL=requests.service.js.map