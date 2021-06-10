import { User } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event/event.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ImageEntity } from "../../utils/image-entity.entity";

@Entity()
export class Kudo extends ImageEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id?: string;
    @Column({ name: 'sendDateTime' })
    sendDateTime?: Date;

    @ManyToOne(() => Event, event => event.kudos, { nullable: true })
    event?: Event

    @ManyToOne(() => User, user => user.sentKudos)
    sender?: User;

    @ManyToOne(() => User, user => user.receivedKudos)
    receiver?: User;

    public constructor(id?: string, imageUrl?: string, event?: Event, sender?: User, receiver?: User) {
        super(imageUrl);
        this.id = id;
        this.sendDateTime = new Date();
        this.event = event;
        this.sender = sender;
        this.receiver = receiver;
    }

    isNewValid(): boolean {
        return !(!this.event && !this.receiver);
    }
}
