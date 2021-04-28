import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CreateKudoDto } from "../api/dto/create-kudo.dto";

@Entity()
export class Kudo {
    @PrimaryGeneratedColumn('uuid')
    private _id: string;
    @Column({nullable: true})
    private _imageUrl: string;
    @Column()
    private _sendDateTime: Date;
    @Column()
    private _senderId: string;
    @Column()
    private _receiverId: string;

    private constructor(senderId: string, receiverId: string, sendDateTime: Date) {
        this._senderId = senderId;
        this._receiverId = receiverId;
        this._sendDateTime = new Date();
    }

    static fromCreateKudoDto(dto: CreateKudoDto): Kudo {
        return new Kudo(dto.senderId, dto.receiverId, new Date())
    }

    public get id() {
        return this._id;
    }
}
