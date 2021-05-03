import { Event } from "src/models/event/entities/event.entity";

export class User {
    private _id: string;

    private _events: Event[];

    constructor(id?: string) {
        this._id = id;
    }
}