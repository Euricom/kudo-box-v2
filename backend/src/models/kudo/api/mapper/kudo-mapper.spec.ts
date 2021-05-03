import { CreateKudoDto } from "../dto/create-kudo.dto"
import { v4 as uuid } from 'uuid';
import { KudoMapper } from "./kudo-mapper";

describe('kudo-mapper', () => {
    it('fromCreateKudoDto', () => {
        const kudoDto = new CreateKudoDto(uuid(), uuid(), {} as Express.Multer.File);

        const kudo = KudoMapper.fromCreateKudoDto(kudoDto);

        expect(kudo.receiverId).toMatch(kudoDto.receiverId);
        expect(kudo.senderId).toMatch(kudoDto.senderId);
    })
})