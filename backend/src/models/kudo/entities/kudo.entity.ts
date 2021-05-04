import { Tag } from "src/models/event/entities/tag.entity";
import { User } from "src/models/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Kudo {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id: string;
    @Column({name: 'imageUrl', nullable: true})
    private _imageUrl: string;
    @Column({name: 'sendDateTime'})
    private _sendDateTime: Date;
    
    @ManyToMany(() => Tag, tag => tag.kudos)
    @JoinTable({name: 'kudo_tag'})
    private _tags: Tag[];
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

    public get id() {
        return this._id;
    }

    public set id(id: string) {
        this._id = id;
    }

    public get imageUrl(): string {
        return this._imageUrl;
    }

    public set imageUrl(url: string) {
        this._imageUrl = url;
    }

    public get sendDateTime(): Date {
        return this._sendDateTime;
    }

    public set sendDateTime(dateTime: Date) {
        this._sendDateTime = dateTime;
    }

    public get sender(): User {
        return this._sender;
    }

    public set sender(sender: User) {
        this._sender = sender;
    }

    public get receiver(): User {
        return this._receiver;
    }

    public set receiver(receiver: User) {
        this._receiver = receiver;
    }

    get tags(): Tag[] {
        return this._tags;
    }
}
