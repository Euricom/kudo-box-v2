import { BadRequestException, CanActivate, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';

interface Jwt {
  oid: string
}

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'azure-ad') {
  constructor(configService: ConfigService) {
    super({
      identityMetadata: configService.get('AAD_OPEN_ID_CONFIG_URL'),
      clientID: configService.get('AAD_APP_ID'),
      loggingLevel: configService.get('NODE_ENV') === 'dev' ? 'info' : null,
      loggingNoPII: configService.get('NODE_ENV') === 'dev' ? false : true,
    })
  }

  async validate(data: Jwt): Promise<string> {
    return data.oid;
  }
}

export const AzureADGuard = AuthGuard('azure-ad');
