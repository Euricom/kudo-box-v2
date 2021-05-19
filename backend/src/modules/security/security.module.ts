import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthorizationGuard } from './guard/authorization.guard';

@Global()
@Module({
    imports: [JwtModule.register({verifyOptions: {algorithms: ['RS256']}})],
    providers: [AuthorizationGuard],
    exports: [AuthorizationGuard, JwtModule]
})
export class SecurityModule {}