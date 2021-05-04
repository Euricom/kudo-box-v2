import { BadRequestException } from "@nestjs/common";

export function validateImage(_req: Request, file: Express.Multer.File, cb): void {
    if(file === null) cb(new BadRequestException('File is required'), false);
    else if(file.mimetype !== 'image/webp') cb(new BadRequestException('Incorrect file type'), false);
    else cb(null, true);
}
