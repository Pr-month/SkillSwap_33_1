import {
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../roles.enum';

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

    const ctx: Partial<ExecutionContext> = {
      switchToHttp: () => ({
        getRequest: jest
          .fn()
          .mockReturnValue({ user: { role: UserRole.USER } }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      getHandler: jest.fn(),
    };

    expect(guard.canActivate(ctx as ExecutionContext)).toBe(true);
    expect(getSpy).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if user is not defined in request', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.USER]);

    const ctx: Partial<ExecutionContext> = {
      switchToHttp: () => ({
        getRequest: jest.fn().mockReturnValue({ user: undefined }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      getHandler: jest.fn(),
    };

    expect(() => guard.canActivate(ctx as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw ForbiddenException if user does not have required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);

    const ctx: Partial<ExecutionContext> = {
      switchToHttp: () => ({
        getRequest: jest
          .fn()
          .mockReturnValue({ user: { role: UserRole.USER } }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      getHandler: jest.fn(),
    };

    expect(() => guard.canActivate(ctx as ExecutionContext)).toThrow(
      ForbiddenException,
    );
  });

  it('should call handler if user has required role', () => {
    const getSpy = jest
      .spyOn(reflector, 'get')
      .mockReturnValue([UserRole.ADMIN]);

    const ctx: Partial<ExecutionContext> = {
      switchToHttp: () => ({
        getRequest: jest
          .fn()
          .mockReturnValue({ user: { role: UserRole.ADMIN } }),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      getHandler: jest.fn(),
    };

    expect(guard.canActivate(ctx as ExecutionContext)).toBe(true);
    expect(getSpy).toHaveBeenCalled();
  });
});
