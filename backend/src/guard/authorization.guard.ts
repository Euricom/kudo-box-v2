import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {jwt} from 'jsonwebtoken';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
