import { Kudo } from "../../kudo/entities/kudo.entity";
import { Event } from "../../event/entities/event.entity";
import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;

    @OneToMany(() => Event, event => event.host)
    events?: Event[];
    @OneToMany(() => Kudo, kudo => kudo.sender)
    sentKudos?: Kudo[];
    @OneToMany(() => Kudo, kudo => kudo.receiver)
    receivedKudos?: Kudo[]

    constructor(id?: string, events?: Event[], sentKudos?: Kudo[], receivedKudos?: Kudo[]) {
        this.id = id;
        this.events = events
        this.sentKudos = sentKudos;
        this.receivedKudos = receivedKudos;
    }
}