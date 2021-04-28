import { Injectable } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/models/user/entities/user.entity";

@Injectable()
export class SqlServerConnector {

    createConnection() {
        return TypeOrmModule.forRoot({
            type: 'mssql',
            host: 'localhost',
            port: 1433,
            username: 'sa',
            password: '123',
            database: 'ekudo-dev',
            entities: [User],
            synchronize: true,
            dropSchema: true
          })
    }
}