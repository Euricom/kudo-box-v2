import { Kudo } from "src/models/kudo/entities/kudo.entity";
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

    @OneToMany(() => Kudo, kudo => kudo.event)
    private _kudos: Kudo[];
    @ManyToMany(() => Tag, tag => tag.events)
    @JoinTable({name: 'event_tag'})
    private _tags: Tag[];
    @ManyToOne(() => User, user => user.events)
    private _host: User;
    @ManyToOne(() => Event, event => event.childEvents)
    private _parentEvent: Event;
    @OneToMany(() => Event, event => event.parentEvent)
    private _childEvents: Event[];

    constructor(id?: string, title?: string, isMainEvent?: boolean, tags?: Tag[], host?: User) {
        this._id = id;
        this._title = title;
        this._host = host;
        this._isMainEvent = isMainEvent;
    }

    get id(): string {
        return this._id;
    }

    get host(): User {
        return this._host;
    }

    get tags(): Tag[] {
        return this._tags;
    }

    get parentEvent(): Event {
        return this._parentEvent;
    }

    get childEvents(): Event[] {
        return this._childEvents;
    }

    get kudos(): Kudo[] {
        return this._kudos;
    }
}
