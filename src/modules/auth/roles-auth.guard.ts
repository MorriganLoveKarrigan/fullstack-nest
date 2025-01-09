import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'Token is missing or invalid' });
      }

      let user;
      try {
        user = this.jwtService.verify(token);
      } catch (e) {
        throw new UnauthorizedException({ message: 'Invalid or expired token' });
      }

      req.user = user;
      if (!user.roles || !user.roles.some(role => requiredRoles.includes(role.value))) {
        throw new UnauthorizedException({ message: 'Access denied: insufficient permissions' });
      }

      return true;
    } catch (e) {
      throw e;
    }
  }
}
