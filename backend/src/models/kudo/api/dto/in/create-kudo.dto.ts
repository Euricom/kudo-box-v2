import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateKudoDto {
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

    constructor(kudoImage: Express.Multer.File, receiverId?: string, eventId?: string) {
        this.receiverId = receiverId;
        this.kudoImage = kudoImage;
        this.eventId = eventId;
    }
}
