import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from '../../models/user/user.module';
import { GraphClient } from './service/graph-client';

@Module({
    imports: [HttpModule, UserModule, ConfigModule, ScheduleModule],
    providers: [GraphClient],
})
export class GraphModule {}
