import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/models/user/user.module';

@Module({
    imports: [HttpModule, UserModule, ConfigModule]
})
export class GraphModule {}
