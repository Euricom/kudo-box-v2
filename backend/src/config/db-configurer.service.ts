import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Event } from "../models/event/entities/event/event.entity";
import { Tag } from "../models/event/entities/tag/tag.entity";
import { User } from "../models/user/entities/user.entity";
import { Kudo } from "../models/kudo/entities/kudo.entity";
import { join } from "path";

/**
 * This class is put out of nestjs context because we need to generate a typeorm.json config file
 * This is needed for migrations with typeorm
 * After you have changed some configurations in this file you need to run the script to regenerate the typeorm.json for prod environment
 */
class DbConfigurerService {
    constructor(private env: { [k: string]: string | undefined }){}

    private getValue(key: string): string {
        return this.env[key]!;
    }

    private isProduction(): boolean {
        return this.env.NODE_ENV === 'prod';
    }

    
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mssql',
            host: this.getValue('DB_HOST'),
            port: parseInt(this.getValue('DB_PORT')!),
            username: this.getValue('DB_USERNAME'),
            password: this.getValue('DB_PASSWORD'),
            database: this.getValue('DB_NAME'),
            synchronize: this.getValue('DB_SYNCHRONIZE') === 'true',
            dropSchema: this.getValue('DB_DROP_SCHEMA') === 'true',
            // entities: [Tag, Event, User, Kudo],
            entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
            logging: this.isProduction() ? false : true,
            // migrations: ["migration/*.js"],
            migrations: [join(__dirname, '..', '..', 'migration', '*.js')],
            cli: {
                migrationsDir: "../../migration"
            }
        } as TypeOrmModuleOptions;
    }
}

const dbConfigService = new DbConfigurerService(process.env);

export default dbConfigService;