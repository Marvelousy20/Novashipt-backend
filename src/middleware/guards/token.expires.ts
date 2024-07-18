// token-expiration.guard.ts

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenExpirationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1]; // Assuming token is in Authorization header
    if (token) {
      const decodedToken = jwt.decode(token) as { exp: number };
      if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
        throw new UnauthorizedException('Session expired, please sign-in');
      }
      return true
    }else{
      throw new UnauthorizedException('Please attach a valid request header');
    }
    
  }
}
