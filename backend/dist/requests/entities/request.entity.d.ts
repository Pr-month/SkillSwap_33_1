import { User } from '../../users/entities/user.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { RequestStatus } from '../requests.enum';
export declare class Request {
    id: string;
    createdAt: Date;
    sender: User;
    receiver: User;
    status: RequestStatus;
    offeredSkill: Skill;
    requestedSkill: Skill;
    isRead: boolean;
}
