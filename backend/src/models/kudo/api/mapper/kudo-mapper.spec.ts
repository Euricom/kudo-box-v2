import { CreateKudoDto } from "../dto/create-kudo.dto"
import { v4 as uuid } from 'uuid';
import { KudoMapper } from "./kudo-mapper";

describe('KudoMapper', () => {
    describe('fromCreateKudoDto', () => {
        it('Private kudo should have a receiver and sender and no eventId', () => {
            const kudoDto = new CreateKudoDto(uuid(), {} as Express.Multer.File, uuid());
    
            const kudo = KudoMapper.fromCreateKudoDto(kudoDto);
    
            expect(kudo.receiver).toBeDefined();
            expect(kudo.sender).toBeDefined();
            expect(kudo.receiver!.id).toMatch(kudoDto.receiverId!);
            expect(kudo.sender!.id).toMatch(kudoDto.senderId);
            expect(kudo.event).toBeUndefined();
        })

        it('Public kudo to all hosts should have eventId and senderId', () => {
            const kudoDto = new CreateKudoDto(uuid(), {} as Express.Multer.File, undefined, uuid());

            const kudo = KudoMapper.fromCreateKudoDto(kudoDto);

            expect(kudo.receiver).toBeUndefined();
            expect(kudo.sender).toBeDefined();
            expect(kudo.sender!.id).toBe(kudoDto.senderId);
            expect(kudo.event).toBeDefined();
            expect(kudo.event!.id).toBe(kudoDto.eventId);
        })

        it('Public kudo to specific host have eventId, receiverId and senderId', () => {
            const kudoDto = new CreateKudoDto(uuid(), {} as Express.Multer.File, uuid(), uuid());

            const kudo = KudoMapper.fromCreateKudoDto(kudoDto);

            expect(kudo.receiver).toBeDefined();
            expect(kudo.receiver!.id).toBe(kudoDto.receiverId);
            expect(kudo.sender).toBeDefined();
            expect(kudo.sender!.id).toBe(kudoDto.senderId);
            expect(kudo.event).toBeDefined();
            expect(kudo.event!.id).toBe(kudoDto.eventId);
        })
    })
})