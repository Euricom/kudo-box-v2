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

    @OneToMany(() => Kudo, kudo => kudo.event)
    kudos?: Kudo[];

    @OneToOne(() => Tag, tag => tag.ownerEvent)
    ownedTag?: Tag;

    @ManyToMany(type => Tag, tag => tag.events, { cascade: ['insert'] })
    @JoinTable({name: 'event_tag'})
    tags?: Tag[];

    @ManyToOne(() => User, user => user.events)
    host?: User;

    @ManyToOne(() => Event, event => event.childEvents)
    mainEvent?: Event;
    
    @OneToMany(() => Event, event => event.mainEvent)
    childEvents?: Event[];

    constructor(id?: string, title?: string, isMainEvent?: boolean, imageUrl?: string, kudos?: Kudo[], tags?: Tag[], host?: User, parentEvent?: Event, childEvents?: Event[], ownedTag?: Tag) {
        super(imageUrl);
        this.id = id;
        this.title = title;
        this.isMainEvent = isMainEvent;

        this.kudos = kudos;
        this.tags = tags;
        this.host = host;
        this.mainEvent = parentEvent
        this.childEvents = childEvents
        this.ownedTag = ownedTag;
    }

    createTag (tagName: string): Tag {
        const tag = new Tag(undefined, tagName, [this]);
        this.tags ? this.tags.push(tag) : this.tags = [tag];
        return tag;
    }

    assignMainEvent(mainEvent: Event): void {
        this.mainEvent = mainEvent;
        if(!this.tags) this.tags = [];
        this.tags = [...this.tags, mainEvent.ownedTag!];
        if(mainEvent.tags) this.tags = this.tags.concat(mainEvent.tags);
    }
}
