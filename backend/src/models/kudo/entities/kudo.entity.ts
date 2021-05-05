import { User } from "../../user/entities/user.entity";
import { Event } from "../../event/entities/event.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ImageEntity } from "src/models/utils/image-entity.entity";

@Entity()
export class Kudo extends ImageEntity {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id?: string;
    @Column({name: 'sendDateTime'})
    private _sendDateTime?: Date;
    
    @ManyToOne(() => Event, event => event.kudos, {nullable: true})
    private _event?: Event
    // TODO: remove cascade insert
    @ManyToOne(() => User, user => user.sentKudos, { cascade: ['insert'] })
    private _sender?: User;
    // TODO: remove cascade insert
    @ManyToOne(() => User, user => user.receivedKudos, { cascade: ['insert'] })
    private _receiver?: User;

    public constructor(id?: string, imageUrl?: string, event?: Event, sender?: User, receiver?: User) {
        super(imageUrl);
        this._id = id;
        this._sendDateTime = new Date();

        this._event = event;
        this._sender = sender;
        this._receiver = receiver;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get sendDateTime() {
        return this._sendDateTime;
    }

    set sendDateTime(dateTime) {
        this._sendDateTime = dateTime;
    }

    get sender() {
        return this._sender;
    }

    set sender(sender) {
        this._sender = sender;
    }

    get receiver() {
        return this._receiver;
    }

    set receiver(receiver) {
        this._receiver = receiver;
    }

    get event() {
        return this._event;
    }
}
