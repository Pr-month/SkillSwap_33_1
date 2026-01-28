import {
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../roles.enum';

const createMockContext = (userRole?: UserRole): ExecutionContext =>
  ({
    // Http методы
    switchToHttp: () => ({
      getRequest: jest.fn().mockReturnValue({
        user: userRole ? { role: userRole } : undefined,
      }),
      getResponse: jest.fn(),
      getNext: jest.fn(),
    }),

    // Обязательные методы
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn().mockReturnValue([]),
    getArgByIndex: jest.fn().mockReturnValue(undefined),

    // Остальные (пустые)
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  }) as ExecutionContext;

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should call handler without @Roles', () => {
    // имитируем отсутствие метаданных ролей
    const getSpy = jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const ctx = createMockContext(UserRole.USER);
    expect(guard.canActivate(ctx)).toBe(true);
    expect(getSpy).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if user is not defined in request', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.USER]);

    const ctx = createMockContext();

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException if user does not have required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);

    const ctx = createMockContext(UserRole.USER);

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should call handler if user has required role', () => {
    const getSpy = jest
      .spyOn(reflector, 'get')
      .mockReturnValue([UserRole.ADMIN]);

    const ctx = createMockContext(UserRole.ADMIN);

    expect(guard.canActivate(ctx)).toBe(true);
    expect(getSpy).toHaveBeenCalled();
  });
});
