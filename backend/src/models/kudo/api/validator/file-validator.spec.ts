import { BadRequestException } from "@nestjs/common"
import { validateImage } from "./file-validator"

describe('file-validator', () => {

    it('Valid file - webp', () => {
        const file = {mimetype: 'image/webp'} as Express.Multer.File

        const cb = jest.fn()

        validateImage(null, file, cb);

        expect(cb).toBeCalledTimes(1);
        expect(cb).toBeCalledWith(null, true)
    })

    it('Invalid file - png', () => {
        const file = {mimetype: 'image/png'} as Express.Multer.File

        const cb = jest.fn()

        validateImage(null, file, cb);

        expect(cb).toBeCalledTimes(1);
        expect(cb).toBeCalledWith(new BadRequestException('Incorrect file type'), false)
    })

    it('No file', () => {
        const file = null;
        const cb = jest.fn()

        validateImage(null, file, cb);

        expect(cb).toBeCalledTimes(1);
        expect(cb).toBeCalledWith(new BadRequestException('File is required'), false)
    })
})