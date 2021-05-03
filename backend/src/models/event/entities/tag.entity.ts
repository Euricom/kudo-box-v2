import { ManyToMany, ManyToOne } from "typeorm";
import { Event } from "./event.entity";

export class Tag {
    private _id: string;
    private _name: string;

    @ManyToMany()
    private _events: Event[];

    constructor(id?: string, name?: string) {
        this._id = id;
        this._name = name;
    }

    get id() {
        return this._id;
    }

    get events() {
        return this._events;
    }
}
