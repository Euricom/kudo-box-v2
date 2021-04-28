import { UploadedFile } from "@nestjs/common";
import { IsUUID } from "class-validator";

export class CreateKudoDto {
    @IsUUID()
    readonly senderId: string;
    @IsUUID()
    readonly receiverId: string;
}
