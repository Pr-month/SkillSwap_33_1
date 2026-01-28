import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { GetSkillsQueryDto } from './dto/get-skills-query.dto';
import { SkillsService } from './skills.service';
import { TAuthResponse } from '../auth/types';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    create(req: TAuthResponse, createSkillDto: CreateSkillDto): Promise<import("./entities/skill.entity").Skill>;
    findAll(query: GetSkillsQueryDto): Promise<{
        data: import("./entities/skill.entity").Skill[];
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./entities/skill.entity").Skill>;
    update(id: string, req: TAuthResponse, updateSkillDto: UpdateSkillDto): Promise<import("./entities/skill.entity").Skill>;
    remove(id: string, req: TAuthResponse): Promise<{
        message: string;
    }>;
    addToFavorite(id: string, req: TAuthResponse): Promise<{
        message: string;
    }>;
    removeFromFavorite(id: string, req: TAuthResponse): Promise<{
        message: string;
    }>;
}
