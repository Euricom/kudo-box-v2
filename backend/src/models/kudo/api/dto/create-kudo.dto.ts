import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateKudoDto {
    @IsNotEmpty()
    @IsUUID()
    readonly senderId: string;
    @IsNotEmpty()
    @IsUUID()
    readonly receiverId: string;
    @ApiProperty({type: 'string', format: 'binary'})
    kudoImage: Express.Multer.File;
}
