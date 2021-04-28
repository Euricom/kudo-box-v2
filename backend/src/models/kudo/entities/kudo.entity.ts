import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CreateKudoDto } from "../api/dto/create-kudo.dto";

@Entity()
export class Kudo {
    @PrimaryGeneratedColumn('uuid')
    private id: string;
    @Column()
    private imageUrl: string;
    @Column()
    private sendDateTime: Date;
    @Column()
    private senderId: string;
    @Column()
    private receiverId: string;

    private constructor(imageUrl: string, sendDateTime: Date) {
        this.imageUrl = imageUrl;
        this.sendDateTime = sendDateTime;
    }

    fromCreateKudoDto(dto: CreateKudoDto): Kudo {
        this.senderId = dto.senderId;
        this.receiverId = dto.receiverId;
        this.sendDateTime = new Date();
        return this;
    }
}
