import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "../event/event.entity";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;
    @Column({name: 'name', unique: true, nullable: true})
    name?: string;

    @ManyToMany(() => Event, event => event.tags)
    events?: Event[];

    @OneToOne(() => Event, event => event.ownedTag)
    @JoinColumn()
    ownerEvent?: Event;

    constructor(id?: string, name?: string, events?: Event[], ownerEvent?: Event) {
        this.id = id;
        this.name = name;
        this.events = events;
        this.ownerEvent = ownerEvent;
    }
}
