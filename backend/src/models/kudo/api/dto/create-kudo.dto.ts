import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID, ValidateIf } from "class-validator";

export class CreateKudoDto {
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({ type: 'uuid' })
    readonly senderId: string;
    @IsOptional()
    @IsUUID()
    @ApiProperty({ type: 'uuid' })
    readonly receiverId?: string;
    @IsOptional()
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
