import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class Seeder implements OnApplicationBootstrap {
    constructor(private connection: Connection){}

    onApplicationBootstrap() {
        if(process.env.NODE_ENV === 'dev') this.seedDatabase();
    }

    private seedDatabase(): void {
        return;
    }

}