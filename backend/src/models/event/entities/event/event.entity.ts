import { Kudo } from "../../../kudo/entities/kudo.entity";
import { User } from "../../../user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from "../tag/tag.entity";
import { ImageEntity } from "../../../utils/image-entity.entity";

@Entity()
export class Event extends ImageEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;
    @Column()
    title?: string;
    @Column()
    isMainEvent?: boolean;
    @Column()
    creationDate?: Date;
    @Column()
    active?: boolean;

    @OneToOne(() => Tag, tag => tag.ownerEvent, { cascade: ['insert'] })
    ownedTag?: Tag;

    @OneToMany(() => Kudo, kudo => kudo.event)
    kudos?: Kudo[];

    @ManyToMany(type => Tag, tag => tag.events, { cascade: ['insert'] })
    @JoinTable({ name: 'event_tag' })
    tags?: Tag[];

    @ManyToOne(() => User, user => user.events)
    host?: User;

    @ManyToOne(() => Event, event => event.childEvents)
    mainEvent?: Event;

    @OneToMany(() => Event, event => event.mainEvent)
    childEvents?: Event[];

    constructor(id?: string, title?: string, isMainEvent?: boolean, creationDate?: Date, imageUrl?: string, ownedTag?: Tag, kudos?: Kudo[], tags?: Tag[], host?: User, parentEvent?: Event, childEvents?: Event[]) {
        super(imageUrl);
        this.id = id;
        this.title = title;
        this.isMainEvent = isMainEvent;
        this.ownedTag = ownedTag;
        this.creationDate = creationDate;
        this.active = false;

        this.kudos = kudos;
        this.tags = tags;
        this.host = host;
        this.mainEvent = parentEvent
        this.childEvents = childEvents
    }

    createTag(tagName: string): Tag {
        const tag = new Tag(undefined, tagName, [this]);
        this.ownedTag = tag;
        return tag;
    }

    assignMainEvent(mainEvent: Event): void {
        this.mainEvent = mainEvent;
        if (!this.tags) this.tags = [];
        this.tags = [...this.tags, mainEvent.ownedTag!];
        if (mainEvent.tags) this.tags = this.tags.concat(mainEvent.tags);
    }

    assignHost(host: User) {
        this.host = host;
    }

    toggleActive() {
        this.active = !this.active;
    }
}
