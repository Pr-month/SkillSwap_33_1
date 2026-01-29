import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
export declare class Skill {
    id: string;
    title: string;
    description?: string;
    category: Category;
    images: string[];
    owner: User;
    createdAt: Date;
    updatedAt: Date;
}
