import { IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { CreateKudoDto } from "./dto/create-kudo.dto";

export class CreateKudoParams {
    @IsNotEmpty()
    kudoImage: Express.Multer.File;
    @IsNotEmpty()
    createKudoDto: CreateKudoDto; 
}