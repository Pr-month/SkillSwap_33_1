import { Category } from '../../categories/entities/category.entity';
export type CategoryLike = Omit<Category, 'parent' | 'children'> & {
    parent: Pick<Category, 'id'> | null;
    children: Pick<Category, 'id'>[];
};
declare const categories: CategoryLike[];
export default categories;
