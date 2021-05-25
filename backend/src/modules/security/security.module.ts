import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from '../../config/app-config.module';
import { AzureADStrategy } from './guard/authorization.guard';

@Global()
@Module({
    imports: [PassportModule, AppConfigModule],
    providers: [AzureADStrategy],
    exports: [AzureADStrategy]
})
export class SecurityModule { }