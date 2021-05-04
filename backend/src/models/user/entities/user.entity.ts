import { Event } from "../../event/entities/event.entity";
import { Kudo } from "../../kudo/entities/kudo.entity";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id?: string;

    @OneToMany(() => Event, event => event.host)
    private _events?: Event[];
    @ManyToOne(() => Kudo, kudo => kudo.sender)
    private _sentKudos?: Kudo[];
    @ManyToOne(() => Kudo, kudo => kudo.receiver)
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

    get receivedKudos() {
        return this._receivedKudos;
    }
}