import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthorizationGuard implements CanActivate {
  
  canActivate(context: ExecutionContext): boolean {
    const bearerJwt = context.switchToHttp().getRequest<Request>();
  }

  private validateSignature() {
    jwt.va
  }
}
