import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id?: string;
    @Column({name: 'name'})
    private _name?: string;

    @ManyToMany(() => Event, event => event.tags)
    private _events?: Event[];

    constructor(id?: string, name?: string, events?: Event[]) {
        this._id = id;
        this._name = name;
        this._events = events;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get events() {
        return this._events;
    }
}
