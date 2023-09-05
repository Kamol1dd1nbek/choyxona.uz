import {
  Injectable,
  ExecutionContext,
  CanActivate,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ActiveGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext) {
    const isActive = this.reflector.getAllAndOverride('isActive', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isActive) return true;
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({
        message: 'The user has not been authorized.',
      });
    }
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'The user has not been authorized..',
      });
    }
    let user: any; 
    try {
      user = this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch (error) {
      try {
        user = this.jwtService.verify(token, {
          secret: process.env.ACCESS_TOKEN_KEY,
        });
      } catch (error) {
        throw new UnauthorizedException({
          message: 'The user has not been authorized..',
        });
      }
    }
    req.user = user;
    const permission = user.is_active === true;
    if (!permission) {
      throw new ForbiddenException({ message: 'User is not active' });
    }

    return true;
  }
}
