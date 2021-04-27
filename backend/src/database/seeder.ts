import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { User } from "src/models/user/entities/user.entity";
import { Connection } from "typeorm";

@Injectable()
export class Seeder implements OnApplicationBootstrap {
    constructor(private connection: Connection){}

    onApplicationBootstrap() {
        this.seedDatabase();
    }

    private seedDatabase(): void {
        this.connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
                new User('tim', 'françois')
            ])
            .execute();
    }

}