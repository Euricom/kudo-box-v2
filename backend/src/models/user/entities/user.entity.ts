import { Kudo } from "../../kudo/entities/kudo.entity";
import { Event } from "../../event/entities/event/event.entity";
import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;
    name?: string;

    @OneToMany(() => Event, event => event.host)
    events?: Event[];
    @OneToMany(() => Kudo, kudo => kudo.sender)
    sentKudos?: Kudo[];
    @OneToMany(() => Kudo, kudo => kudo.receiver)
    receivedKudos?: Kudo[]

    constructor(id?: string, name?: string, events?: Event[], sentKudos?: Kudo[], receivedKudos?: Kudo[]) {
        this.id = id;
        this.name = name;
        this.events = events
        this.sentKudos = sentKudos;
        this.receivedKudos = receivedKudos;
    }
}