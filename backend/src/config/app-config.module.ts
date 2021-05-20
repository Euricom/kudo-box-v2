import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DbConfigurerService } from "./db-configurer.service";

@Module({
    imports: [
        ConfigModule.forRoot({envFilePath: `./src/config/environment/.${process.env.NODE_ENV}.env`}),
    ],
    providers: [DbConfigurerService, ConfigService],
    exports: [DbConfigurerService, ConfigModule]
})
export class AppConfigModule {}