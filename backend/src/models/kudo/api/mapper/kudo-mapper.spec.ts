import { CreateKudoDto } from "../dto/in/create-kudo.dto"
import { v4 as uuid } from 'uuid';
import { KudoMapper } from "./kudo-mapper";
import { Kudo } from "../../entities/kudo.entity";
import { User } from "../../../../models/user/entities/user.entity";
import { Event } from "../../../../models/event/entities/event/event.entity";
import { Test } from "@nestjs/testing";
import { ImageClientService } from "../../../../modules/image/service/image-client.service";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { AppConfigModule } from "../../../../config/app-config.module";
import { InternalServerErrorException } from "@nestjs/common/exceptions";

describe('KudoMapper', () => {

    let kudoMapper: KudoMapper
    let imageService: ImageClientService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppConfigModule],
            providers: [KudoMapper, ImageClientService, ConfigService]
        }).compile();

        kudoMapper = await module.resolve(KudoMapper);
        imageService = await module.resolve(ImageClientService);
    })

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

    describe('toKudoDto', () => {
        it('Get public kudo with eventId, receiverId and senderId, image', async () => {

            const kudo = new Kudo(uuid(), "base64String", new Event(uuid()), new User((uuid())), new User(uuid()));
            jest.spyOn(imageService, "getImage").mockImplementation(() => {
                return Promise.resolve("base64String")
            })
            const kudoDto = await kudoMapper.toKudoDto(kudo);

            expect(kudoDto.senderId).toBeDefined();
            expect(kudoDto.senderId).toBe(kudo.sender!.id);
            expect(kudoDto.receiverId).toBeDefined();
            expect(kudoDto.receiverId).toBe(kudo.receiver!.id);
            expect(kudoDto.eventId).toBeDefined();
            expect(kudoDto.eventId).toBe(kudo.event!.id);
            expect(kudoDto.kudoImage).toBeDefined();
            expect(kudoDto.kudoImage).toBe(kudo.imageUrl);
        })

        it('Get public kudo without eventId, receiverId and senderId, image', async () => {

            const kudo = new Kudo();
            jest.spyOn(imageService, "getImage").mockImplementation(() => {
                return Promise.resolve("base64String")
            })

            try {
                await kudoMapper.toKudoDto(kudo);
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                const exc = e as InternalServerErrorException;
                expect(exc.message).toBe('Something went wrong getting your kudo')
            }
        })
    })
})