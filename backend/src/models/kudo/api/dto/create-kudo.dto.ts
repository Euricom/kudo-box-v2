import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateKudoDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ type: 'uuid' })
    readonly senderId: string;
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ type: 'uuid' })
    readonly receiverId?: string;
    @IsUUID()
    @ApiProperty({ type: 'uuid' })
    readonly eventId?: string;
    @ApiProperty({type: 'string', format: 'binary'})
    readonly kudoImage: Express.Multer.File;

    constructor(senderId: string, kudoImage: Express.Multer.File, receiverId?: string, eventId?: string) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.kudoImage = kudoImage;
        this.eventId = eventId;
    }
}
