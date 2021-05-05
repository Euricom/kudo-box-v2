import { BadRequestException } from "@nestjs/common";

type cbDef = (error: Error | null, acceptFile: boolean) => void;

const validTypes = ['image/webp', 'image/png', 'image/jpeg', 'image/gif'];

export function validateImage(_req: Request, file: Express.Multer.File, cb: cbDef): void {
    if(Object.keys(file).length === 0) cb(new BadRequestException('File is required'), false);
    else if(!validTypes.includes(file.mimetype)) cb(new BadRequestException('Incorrect file type'), false);
    else cb(null, true);
}