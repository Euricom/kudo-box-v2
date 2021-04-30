import { BadRequestException } from "@nestjs/common";

export function validateImage(_, file: Express.Multer.File, cb) {
    if(file.mimetype !== 'image/webp') cb(new BadRequestException('Incorrect file type'), false);
    else cb(null, true);
}