import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    id?: string;
    @Column({name: 'name', unique: true})
    name?: string;

    @ManyToMany(() => Event, event => event.tags)
    events?: Event[];

    constructor(id?: string, name?: string, events?: Event[]) {
        this.id = id;
        this.name = name;
        this.events = events;
    }
}
