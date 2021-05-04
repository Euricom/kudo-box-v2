import { Event } from "src/models/event/entities/event.entity";
import { User } from "src/models/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Kudo {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id: string;
    @Column({name: 'imageUrl', nullable: true})
    private _imageUrl: string;
    @Column({name: 'sendDateTime'})
    private _sendDateTime: Date;
    
    @ManyToOne(() => Event, event => event.kudos, {nullable: true})
    private _event: Event
    @ManyToOne(() => User, user => user.sentKudos)
    private _sender: User;
    @ManyToOne(() => User, user => user.receivedKudos)
    private _receiver: User;

    public constructor(sender?: User, receiver?: User, imageUrl?: string) {
        this._sender = sender;
        this._receiver = receiver;
        this._imageUrl = imageUrl;
        this._sendDateTime = new Date();
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    set imageUrl(url: string) {
        this._imageUrl = url;
    }

    get sendDateTime(): Date {
        return this._sendDateTime;
    }

    set sendDateTime(dateTime: Date) {
        this._sendDateTime = dateTime;
    }

    get sender(): User {
        return this._sender;
    }

    set sender(sender: User) {
        this._sender = sender;
    }

    get receiver(): User {
        return this._receiver;
    }

    set receiver(receiver: User) {
        this._receiver = receiver;
    }

    get event(): Event {
        return this._event;
    }
}
