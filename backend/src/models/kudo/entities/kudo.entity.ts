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

    private constructor(senderId: string, receiverId: string) {
        this._senderId = senderId;
        this._receiverId = receiverId;
        this._sendDateTime = new Date();
    }

    static fromCreateKudoDto(dto: CreateKudoDto): Kudo {
        return new Kudo(dto.senderId, dto.receiverId)
    }

    public get id() {
        return this._id;
    }
}
