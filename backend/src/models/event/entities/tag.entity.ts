import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id?: string;
    @Column({name: 'name', unique: true})
    private _name?: string;

    @ManyToMany(() => Event, event => event.tags)
    events?: Event[];

    constructor(id?: string, name?: string, events?: Event[]) {
        this._id = id;
        this._name = name;
        this.events = events;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get name() {
        return this._name;
    }

    // get events() {
    //     return this._events;
    // }
}
