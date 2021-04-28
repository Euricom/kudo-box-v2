import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
        if(file.mimetype !== 'image/webp') throw new BadRequestException('Incorrect file type');
        return file;
    }

}