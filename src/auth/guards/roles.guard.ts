import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { TAuthResponse } from '../types';

/**
 * Гард для проверки ролей пользователей.
 *
 * Использование:
 * - Добавить декоратор `@UseGuards(AccessTokenGuard, RolesGuard)`
 * - Указать требуемые роли через `@Roles(UserRole.USER, UserRole.ADMIN)`
 * - Доступные роли определены в enum UserRole в src/auth/roles.enum
 * - Ожидает, что `request.user.role` (полученный из JWT) совпадает с одной из указанных ролей.
 *
 * Пример:
 *   @UseGuards(AccessTokenGuard, RolesGuard)
 *   @Roles(UserRole.ADMIN)
 *   @Delete(':id')
 *   removeUser(@Param('id') id: string) { ... }
 *
 * Исключения:
 * - `UnauthorizedException`, если пользователь не авторизован
 * - `ForbiddenException`, если роль пользователя не соответствует требуемым
 */

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!required) return true;

    const request = context.switchToHttp().getRequest<TAuthResponse>();
    const user = request.user;
    if (!user) throw new UnauthorizedException('Пользователь не авторизован');

    if (!required.includes(user.role))
      throw new ForbiddenException('Доступ запрещен');
    return true;
  }
}
