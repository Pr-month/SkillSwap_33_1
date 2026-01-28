import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { GetSkillsQueryDto } from './dto/get-skills-query.dto';
import { User } from '../users/entities/user.entity';
export declare class SkillsService {
    private skillRepository;
    private userRepository;
    constructor(skillRepository: Repository<Skill>, userRepository: Repository<User>);
    create(ownerId: string, createSkillDto: CreateSkillDto): Promise<Skill>;
    findAll(query: GetSkillsQueryDto): Promise<{
        data: Skill[];
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Skill>;
    update(userId: string, id: string, updateSkillDto: UpdateSkillDto): Promise<Skill>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
    addToFavorite(userId: string, skillId: string): Promise<{
        message: string;
    }>;
    removeFromFavorite(userId: string, skillId: string): Promise<{
        message: string;
    }>;
}
