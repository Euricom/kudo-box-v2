import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { User } from "src/models/user/entities/user.entity";

@Injectable()
export class DbConfigurerService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService){}
    
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mssql',
            host: this.configService.get<string>('DB_HOST'),
            port: +this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
            synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE'),
            dropSchema: this.configService.get<boolean>('DB_DROP_SCHEMA'),
            entities: [User],
        } as TypeOrmModuleOptions;
    }

}