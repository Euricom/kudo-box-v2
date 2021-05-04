import { Event } from "src/models/event/entities/event.entity";
import { Kudo } from "src/models/kudo/entities/kudo.entity";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id: string;

    @OneToMany(() => Event, event => event.host)
    private _events: Event[];
    @ManyToOne(() => Kudo, kudo => kudo.sender)
    private _sentKudos: Kudo[];
    @ManyToOne(() => Kudo, kudo => kudo.receiver)
    private _receivedKudos: Kudo[]

    constructor(id?: string) {
        this._id = id;
    }

    get events(): Event[] {
        return this._events;
    }

    get sentKudos(): Kudo[] {
        return this._sentKudos;
    }

    get receivedKudos(): Kudo[] {
        return this._receivedKudos;
    }
}