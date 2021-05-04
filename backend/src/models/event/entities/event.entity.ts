import { User } from "src/models/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from "./tag.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id: string;
    @Column({name: 'title'})
    private _title: string;
    @Column({name: 'isMainEvent'})
    private _isMainEvent: boolean;

    @ManyToMany(() => Tag, tag => tag.events)
    @JoinTable({name: 'event_tag'})
    private _tags: Tag[];

    @ManyToOne(() => User, user => user.events)
    private _host: User;

    constructor(id?: string, title?: string, isMainEvent?: boolean, tags?: Tag[], host?: User) {
        this._id = id;
        this._title = title;
        this._isMainEvent = isMainEvent;
        this._tags = tags;
        this._host = host;
    }

    get id() {
        return this._id;
    }

    get tags() {
        return this._tags;
    }

    get host() {
        return this._host;
    }

    generateTag(title: string): Tag {
        const noVowelTitle = title.replace(/[aeuio ]/gi, '');
        const tag = new Tag(null, noVowelTitle);
        this._tags.push(tag);
        return tag;
    }
}
