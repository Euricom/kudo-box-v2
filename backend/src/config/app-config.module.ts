import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({envFilePath: `./src/config/environment/.${process.env.NODE_ENV}.env`}),
    ],
    providers: [ConfigService],
    exports: [ConfigModule]
})
export class AppConfigModule {}