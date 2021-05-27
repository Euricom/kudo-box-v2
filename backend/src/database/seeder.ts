import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { Event } from "../models/event/entities/event/event.entity";
import { Tag } from "../models/event/entities/tag/tag.entity";
import { User } from "../models/user/entities/user.entity";
import { Connection } from "typeorm";
import { Kudo } from "src/models/kudo/entities/kudo.entity";

@Injectable()
export class Seeder implements OnApplicationBootstrap {
    constructor(private connection: Connection) { }

    onApplicationBootstrap() {
        if (process.env.NODE_ENV === 'dev') this.seedDatabase();
    }

    private async seedDatabase(): Promise<void> {
        const tag1 = new Tag('e29d0d75-6b5e-49c6-89b4-a8e6954f67a8', 'rxjs', undefined)
        const event1 = new Event('7a73e957-45ad-445d-b9f8-ebd6e2807f85', 'How to Rxjs', true, new Date(), 'example.com', tag1, [], [], undefined, undefined, undefined);

        const tag2 = new Tag('cb4b49da-7c34-4313-91b1-d263516b013a', 'acc', undefined)
        const event2 = new Event('f14c73cd-133b-4944-af3a-883de2962267', 'Angular crash course', true, new Date(), 'example.com', tag2, [], [], undefined, undefined, undefined);

        const tag3 = new Tag('b09c065a-e279-46b6-9fd5-f8343a75ad82', 'rxjs-adv', undefined)
        const event3 = new Event('3ada5d42-03dc-4a9d-9e6e-964be1b0306d', 'Advanced Rxjs', true, new Date(), 'example.com', tag3, [], [], undefined, undefined, undefined);

        const tim = new User('e1d5e4d8-1ee4-402b-92a9-c89632216b19', 'Tim', 'François', 'tim@euri.com', [event1], undefined, undefined);
        event1.host = tim;
        event3.host = tim;

        const lennert = new User('4e636f54-841d-4967-a6a5-ba922e7235ea', 'Lennert', 'Moorthamer', 'lennert@euri.com', [event2], undefined, undefined);
        event2.host = lennert;

        const kudo1 = new Kudo('13da402d-6a6f-4daa-a0ff-2b608412cdaa', 'https://ekudos.blob.core.windows.net/ekudo-dev/kudo-34bed51a-d5d4-4d5f-a23b-5babccdd51fd.webp', undefined, tim, lennert);
        const kudo2 = new Kudo('ebe8346a-6c39-4782-bca5-fb08b8b72859', 'https://ekudos.blob.core.windows.net/ekudo-dev/kudo-34bed51a-d5d4-4d5f-a23b-5babccdd51fd.webp', undefined, tim, lennert);
        const kudo3 = new Kudo('4433ef90-a485-4b3e-abb4-513166d19b4e', 'https://ekudos.blob.core.windows.net/ekudo-dev/kudo-34bed51a-d5d4-4d5f-a23b-5babccdd51fd.webp', undefined, tim, lennert);
        const kudo4 = new Kudo('b1f28c6c-493e-46ab-87b5-5bf2dcb7757d', 'https://ekudos.blob.core.windows.net/ekudo-dev/kudo-34bed51a-d5d4-4d5f-a23b-5babccdd51fd.webp', undefined, tim, lennert);

        const kudo5 = new Kudo('989d626e-9f0f-42b0-89d1-487ae696ff36', 'https://ekudos.blob.core.windows.net/ekudo-dev/kudo-34bed51a-d5d4-4d5f-a23b-5babccdd51fd.webp', undefined, lennert, tim);
        const kudo6 = new Kudo('116c1534-6afa-4f48-8c7a-18cd08114f1e', 'https://ekudos.blob.core.windows.net/ekudo-dev/kudo-34bed51a-d5d4-4d5f-a23b-5babccdd51fd.webp', undefined, lennert, tim);
        const kudo7 = new Kudo('d3faab5c-d6c8-4131-b7ab-095f8f460d37', 'https://ekudos.blob.core.windows.net/ekudo-dev/kudo-34bed51a-d5d4-4d5f-a23b-5babccdd51fd.webp', undefined, lennert, tim);
        const kudo8 = new Kudo('fcb06100-c988-4e14-b417-0483514f28f0', 'https://ekudos.blob.core.windows.net/ekudo-dev/kudo-34bed51a-d5d4-4d5f-a23b-5babccdd51fd.webp', undefined, lennert, tim);

        await this.connection.createQueryBuilder()
            .insert()
            .into(User)
            .values([tim, lennert])
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Event)
            .values(event1)
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Event)
            .values(event2)
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Event)
            .values(event3)
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Kudo)
            .values([kudo1, kudo2, kudo3, kudo4, kudo5, kudo6, kudo7, kudo8])
            .execute();

        tag1.events = [event1];
        tag2.events = [event2];
        tag3.events = [event3];

        await this.connection.createQueryBuilder()
            .relation(User, 'events')
            .of(tim)
            .add(event1);

        await this.connection.createQueryBuilder()
            .relation(User, 'events')
            .of(lennert)
            .add(event2);

        await this.connection.createQueryBuilder()
            .insert()
            .into(Tag)
            .values(tag1)
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Tag)
            .values(tag2)
            .execute();

        await this.connection.createQueryBuilder()
            .insert()
            .into(Tag)
            .values(tag3)
            .execute();

        await this.connection.createQueryBuilder()
            .relation(Event, 'ownedTag')
            .of(event1)
            .set(tag1);

        await this.connection.createQueryBuilder()
            .relation(Event, 'ownedTag')
            .of(event2)
            .set(tag2);

        await this.connection.createQueryBuilder()
            .relation(Event, 'ownedTag')
            .of(event3)
            .set(tag3);
    }

    private async seedUsers(): Promise<void> {



    }

}