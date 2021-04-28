import { Module } from "@nestjs/common";
import { SqlServerConnector } from "./sql-server-connector.service";

@Module({
    exports: [SqlServerConnector]
})
export class SqlServerModule{}