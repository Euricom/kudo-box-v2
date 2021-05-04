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

        if(this._title) this.generateTag(this._title);
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

    private generateTag(title: string): void {
        const noVowelTitle = title.replace(/[aeuio ]/gi, '');
        this._tags.push(new Tag(null, noVowelTitle))
    }
}
