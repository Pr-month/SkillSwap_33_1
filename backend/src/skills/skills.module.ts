import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { Skill } from './entities/skill.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { IsUrlWithConfig } from '../utils/custom-url-validator.util';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, Category, User])],
  controllers: [SkillsController],
  providers: [SkillsService, IsUrlWithConfig],
})
export class SkillsModule {}
