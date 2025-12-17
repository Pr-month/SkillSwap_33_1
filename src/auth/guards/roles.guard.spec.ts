import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../roles.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = { get: jest.fn() } as any;
    guard = new RolesGuard(reflector);
  });

  it('should call handler without @Roles', () => {
    // имитируем отсутствие метаданных ролей
    (reflector.get as jest.Mock).mockReturnValue(undefined);

    const ctx: any = {
      switchToHttp: () => ({ getRequest: () => ({ user: { role: UserRole.USER } }) }),
      getHandler: () => ({}),
    };

    expect(guard.canActivate(ctx)).toBe(true);
    expect(reflector.get).toHaveBeenCalled(); 
  });

  it('should throw UnauthorizedException if user is not defined in request', () => {
    (reflector.get as jest.Mock).mockReturnValue([UserRole.USER]); 

    const ctx: any = {
      getHandler: () => ({}),
      switchToHttp: () => ({ getRequest: () => ({ user: undefined }) }),
    };

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException if user does not have required role', () => {
    (reflector.get as jest.Mock).mockReturnValue([UserRole.ADMIN]); 
    
    const ctx: any = {
      getHandler: () => ({}),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: UserRole.USER } }) }),
    };

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should call handler if user has required role', () => {
    (reflector.get as jest.Mock).mockReturnValue([UserRole.ADMIN]); 
    
    const ctx: any = {
      getHandler: () => ({}),
      switchToHttp: () => ({ getRequest: () => ({ user: { role: UserRole.ADMIN } }) }),
    };

    expect(guard.canActivate(ctx)).toBe(true);
    expect(reflector.get).toHaveBeenCalled(); 
  });
});