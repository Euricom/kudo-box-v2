import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";

export function validateImage(_, file: Express.Multer.File, cb) {
    if(file.size >= 1) cb(new BadRequestException('File size exceeds limit'), false);
    else if(file.mimetype !== 'image/webp') cb(new BadRequestException('Incorrect file type'), false);
    else cb(null, true);
}