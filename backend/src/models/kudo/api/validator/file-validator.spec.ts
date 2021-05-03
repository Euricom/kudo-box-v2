import { BadRequestException } from "@nestjs/common"
import { validateImage } from "./file-validator"

describe('FileValidator', () => {
    describe('validateImage', () => {
        it('Valid file - webp', () => {
            const file = {mimetype: 'image/webp'} as Express.Multer.File
    
            const cb = jest.fn();
    
            validateImage(file, cb);
    
            expect(cb).toBeCalledTimes(1);
            expect(cb).toBeCalledWith(null, true)
        })

        it('Invalid file - png - BadRequestException should be thrown', () => {
            const file = {mimetype: 'image/png'} as Express.Multer.File
    
            const cb = jest.fn()
    
            validateImage(file, cb);
    
            expect(cb).toBeCalledTimes(1);
            expect(cb).toBeCalledWith(new BadRequestException('Incorrect file type'), false)
        })

        it('Invalid file - jpeg - BadRequestException should be thrown', () => {
            const file = {mimetype: 'image/jpeg'} as Express.Multer.File
    
            const cb = jest.fn()
    
            validateImage(file, cb);
    
            expect(cb).toBeCalledTimes(1);
            expect(cb).toBeCalledWith(new BadRequestException('Incorrect file type'), false)
        })

        it('Invalid file - gif - BadRequestException should be thrown', () => {
            const file = {mimetype: 'image/gif'} as Express.Multer.File
    
            const cb = jest.fn()
    
            validateImage(file, cb);
    
            expect(cb).toBeCalledTimes(1);
            expect(cb).toBeCalledWith(new BadRequestException('Incorrect file type'), false)
        })

        it('No file - BadRequestException should be thrown', () => {
            const file = null;
            const cb = jest.fn()
    
            validateImage(file, cb);
    
            expect(cb).toBeCalledTimes(1);
            expect(cb).toBeCalledWith(new BadRequestException('File is required'), false)
        })
    })
})