import { Kudo } from "../../kudo/entities/kudo.entity";
import { Event } from "../../event/entities/event.entity";
import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id?: string;

    @OneToMany(() => Event, event => event.host)
    private _events?: Event[];
    @OneToMany(() => Kudo, kudo => kudo.sender)
    private _sentKudos?: Kudo[];
    @OneToMany(() => Kudo, kudo => kudo.receiver)
    private _receivedKudos?: Kudo[]

    constructor(id?: string, events?: Event[], sentKudos?: Kudo[], receivedKudos?: Kudo[]) {
        this._id = id;
        this._events = events
        this._sentKudos = sentKudos;
        this._receivedKudos = receivedKudos;
    }

    get id() {
        return this._id;
    }

    get events() {
        return this._events;
    }

    get sentKudos() {
        return this._sentKudos;
    }

    set sentKudos(kudos) {
        this._sentKudos = kudos;
    }

    get receivedKudos() {
        return this._receivedKudos;
    }

    set receivedKudos(kudos) {
        this._receivedKudos = kudos;
    }
}