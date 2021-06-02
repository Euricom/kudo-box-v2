import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";

require('dotenv').config();

/**
 * This class is put out of nestjs context because we need to generate a ormconfig.json config file
 * This is needed for migrations with typeorm
 * After you have changed some configurations in this file you need to run the script to regenerate the ormconfig.json for prod environment
 * https://stackoverflow.com/a/59990681
 * https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f
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
            entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
            logging: this.isProduction() ? false : true,
            migrations: [join(__dirname, '..', '..', 'migration', '*.js')],
            cli: {
                migrationsDir: 'migration'
            }
        } as TypeOrmModuleOptions;
    }
}

const dbConfigService = new DbConfigurerService(process.env);

export default dbConfigService;