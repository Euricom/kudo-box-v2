import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface Jwt {
  header: {
    typ: string;
    kid: string;
  }
  payload: {
    exp: number;
    aud: string;
    appid: string;
    tid: string;
  }
}

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {}
  
  canActivate(context: ExecutionContext): boolean {
    const jwt = this.getJwt(context.switchToHttp().getRequest<Request>())

    const decodedJwt = this.jwtService.decode(jwt, {complete: true}) as Jwt;

    this.verifySignature(jwt, decodedJwt);

    console.log(decodedJwt.header.typ);
    
    return true;
  }

  private getJwt(req: Request): string {
    const bearerJwt = req.header('Authorization');
    if(!bearerJwt) throw new BadRequestException('No Authhirozation header');

    return bearerJwt.replace('Bearer ', '');
  }

  private verifySignature(jwt: string, decodedJwt: Jwt) {
    this.jwtService.verify(jwt, {
      publicKey: decodedJwt.header.kid,
    })
  }
}
