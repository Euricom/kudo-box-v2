import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Event } from "../models/event/entities/event.entity";
import { Tag } from "../models/event/entities/tag.entity";
import { User } from "../models/user/entities/user.entity";
import { Kudo } from "../models/kudo/entities/kudo.entity";

@Injectable()
export class DbConfigurerService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService){}
    
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mssql',
            host: this.configService.get<string>('DB_HOST'),
            port: parseInt(this.configService.get('DB_PORT')!),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
            synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE'),
            dropSchema: this.configService.get<boolean>('DB_DROP_SCHEMA'),
            entities: [Kudo, Event, Tag, User],
        } as TypeOrmModuleOptions;
    }

}