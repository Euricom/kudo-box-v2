import { CreateKudoDto } from "../dto/create-kudo.dto"
import { v4 as uuid } from 'uuid';
import { KudoMapper } from "./kudo-mapper";

describe('KudoMapper', () => {
    describe('fromCreateKudoDto', () => {
        it('It should return correct Kudo', () => {
            const kudoDto = new CreateKudoDto(uuid(), uuid(), {} as Express.Multer.File);
    
            const kudo = KudoMapper.fromCreateKudoDto(kudoDto);
    
            expect(kudo.receiver).toMatch(kudoDto.receiverId);
            expect(kudo.senderId).toMatch(kudoDto.senderId);
        })
    })
})