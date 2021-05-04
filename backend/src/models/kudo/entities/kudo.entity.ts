import { Event } from "../../event/entities/event.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Kudo {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id?: string;
    @Column({name: 'imageUrl', nullable: true})
    private _imageUrl?: string;
    @Column({name: 'sendDateTime'})
    private _sendDateTime?: Date;
    
    @ManyToOne(() => Event, event => event.kudos, {nullable: true})
    private _event?: Event
    @ManyToOne(() => User, user => user.sentKudos)
    private _sender?: User;
    @ManyToOne(() => User, user => user.receivedKudos)
    private _receiver?: User;

    public constructor(id?: string, imageUrl?: string, event?: Event, sender?: User, receiver?: User) {
        this._id = id;
        this._imageUrl = imageUrl;
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

    get imageUrl() {
        return this._imageUrl;
    }

    set imageUrl(url) {
        this._imageUrl = url;
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
