import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CreateKudoDto } from "../api/dto/create-kudo.dto";

@Entity()
export class Kudo {
    @PrimaryGeneratedColumn('uuid', {name: 'id'})
    private _id: string;
    @Column({name: 'imageUrl', nullable: true})
    private _imageUrl: string;
    @Column({name: 'sendDateTime'})
    private _sendDateTime: Date;
    @Column({name: 'senderId'})
    private _senderId: string;
    @Column({name: 'receiverId'})
    private _receiverId: string;

    public constructor(senderId?: string, receiverId?: string, imageUrl?: string) {
        this._senderId = senderId;
        this._receiverId = receiverId;
        this._imageUrl = imageUrl;
        this._sendDateTime = new Date();
    }

    static fromCreateKudoDto(dto: CreateKudoDto): Kudo {
        return new Kudo(dto.senderId, dto.receiverId)
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

    public get senderId(): string {
        return this._senderId;
    }

    public set senderId(id: string) {
        this._senderId = id;
    }

    public get receiverId(): string {
        return this._receiverId;
    }

    public set receiverId(id: string) {
        this._receiverId = id;
    }
}
