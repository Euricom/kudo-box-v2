import { User } from "src/models/user/entities/user.entity";
import { OneToMany } from "typeorm";
import { Tag } from "./tag.entity";

export class Event {
    private _id: string;
    private _title: string;
    private _isMainEvent: boolean;

    @OneToMany(() => Tag, tag => tag.events)
    private _tags: Tag[];
    private _host: User;

    constructor(id?: string, title?: string, isMainEvent?: boolean, tags?: Tag[], host?: User) {
        this._id = id;
        this._title = title;
        this._isMainEvent = isMainEvent;
        this._tags = tags;
        this._host = host;
    }
}
