import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { Skill } from '../skills/entities/skill.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { NotificationsGateway } from '../websocket/gateways/notifications/notifications.gateway';
export declare class RequestsService {
    private requestsRepository;
    private skillsRepository;
    private notificationsWs;
    constructor(requestsRepository: Repository<Request>, skillsRepository: Repository<Skill>, notificationsWs: NotificationsGateway);
    create(createRequestDto: CreateRequestDto, senderId: string): Promise<Request>;
    findIncoming(userId: string): Promise<Request[]>;
    findOutgoing(userId: string): Promise<Request[]>;
    update(id: string, updateRequestDto: UpdateRequestDto, userId: string): Promise<Request>;
    remove(id: string, userId: string, isAdmin: boolean): Promise<{
        message: string;
    }>;
}
