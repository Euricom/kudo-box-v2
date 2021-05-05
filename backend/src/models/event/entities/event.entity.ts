import { Kudo } from "../../kudo/entities/kudo.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from "./tag.entity";
import { ImageEntity } from "src/models/utils/image-entity.entity";

@Entity()
export class Event extends ImageEntity {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id?: string;
    @Column({name: 'title'})
    private _title?: string;
    @Column({name: 'isMainEvent'})
    private _isMainEvent?: boolean;

    @OneToMany(() => Kudo, kudo => kudo.event)
    private _kudos?: Kudo[];
    @ManyToMany(() => Tag, tag => tag.events, { cascade: ['insert'] })
    @JoinTable({ name: 'event_tag' })
    private _tags?: Tag[] = [];
    // todo remove cascade create
    @ManyToOne(() => User, user => user.events, { cascade: ['insert'] })
    private _host?: User;
    @ManyToOne(() => Event, event => event.childEvents)
    private _parentEvent?: Event;
    @OneToMany(() => Event, event => event.parentEvent)
    private _childEvents?: Event[];

    constructor(id?: string, title?: string, isMainEvent?: boolean, imageUrl?: string, kudos?: Kudo[], tags?: Tag[], host?: User) {
        super(imageUrl);
        this._id = id;
        this._title = title;
        this._isMainEvent = isMainEvent;

        this._kudos = kudos;
        this._tags = tags;
        this._host = host;
    }

    get id() {
        return this._id;
    }

    get host() {
        return this._host;
    }

    get tags() {
        return this._tags;
    }

    get parentEvent() {
        return this._parentEvent;
    }

    get childEvents() {
        return this._childEvents;
    }

    get kudos() {
        return this._kudos;
    }

    createTag(tagName: string): Tag {
        const tag = new Tag(undefined, tagName, [this]);
        this._tags ? this._tags.push(tag) : this._tags = [tag];
        return tag;
    }
}
