import { CreateKudoDto } from "../dto/in/create-kudo.dto"
import { v4 as uuid } from 'uuid';
import { KudoMapper } from "./kudo-mapper";
import { Kudo } from "../../entities/kudo.entity";
import { User } from "../../../../models/user/entities/user.entity";
import { Event } from "../../../../models/event/entities/event/event.entity";
import { Test } from "@nestjs/testing";
import { ImageClientService } from "../../../../modules/image/service/image-client.service";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { Tag } from "../../../../models/event/entities/tag/tag.entity";
import { UserMapper } from "../../../user/api/mapper/user-mapper";
import { EventMapper } from "../../../../models/event/api/mapper/event-mapper";
import { EventDto } from "../../../event/api/dto/out/Event.dto";

describe('KudoMapper', () => {
    let kudoMapper: KudoMapper
    let imageService: ImageClientService
    let eventMapper: EventMapper;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                KudoMapper,
                {
                    provide: ImageClientService,
                    useValue: {
                        getImage: jest.fn()
                    }
                },
                {
                    provide: EventMapper,
                    useValue: {
                        toEventDto: jest.fn()
                    }
                },
            ]
        }).compile();

        kudoMapper = module.get<KudoMapper>(KudoMapper);
        imageService = module.get<ImageClientService>(ImageClientService);
        eventMapper = module.get<EventMapper>(EventMapper);
    })

    describe('fromCreateKudoDto', () => {
        it('Private kudo should have a receiver and sender and no eventId', () => {
            const senderId = uuid();
            const kudoDto = new CreateKudoDto({} as Express.Multer.File, uuid());

            const kudo = KudoMapper.fromCreateKudoDto(kudoDto, senderId);

            expect(kudo.receiver).toBeDefined();
            expect(kudo.sender).toBeDefined();
            expect(kudo.receiver!.id).toMatch(kudoDto.receiverId!);
            expect(kudo.sender!.id).toMatch(senderId);
            expect(kudo.event).toBeUndefined();
        })

        it('Public kudo to all hosts should have eventId and senderId', () => {
            const senderId = uuid();
            const kudoDto = new CreateKudoDto({} as Express.Multer.File, undefined, uuid());

            const kudo = KudoMapper.fromCreateKudoDto(kudoDto, senderId);

            expect(kudo.receiver).toBeUndefined();
            expect(kudo.sender).toBeDefined();
            expect(kudo.sender!.id).toBe(senderId);
            expect(kudo.event).toBeDefined();
            expect(kudo.event!.id).toBe(kudoDto.eventId);
        })

        it('Public kudo to specific host have eventId, receiverId and senderId', () => {
            const senderId = uuid();
            const kudoDto = new CreateKudoDto({} as Express.Multer.File, uuid(), uuid());

            const kudo = KudoMapper.fromCreateKudoDto(kudoDto, senderId);

            expect(kudo.receiver).toBeDefined();
            expect(kudo.receiver!.id).toBe(kudoDto.receiverId);
            expect(kudo.sender).toBeDefined();
            expect(kudo.sender!.id).toBe(senderId);
            expect(kudo.event).toBeDefined();
            expect(kudo.event!.id).toBe(kudoDto.eventId);
        })
    })

    describe('toBasicKudoDto', () => {
        it('Get public kudo with Id and image', async () => {

            const kudo = new Kudo(uuid(), "base64String", new Event(uuid()), new User(uuid()), new User(uuid()));
            jest.spyOn(imageService, "getImage").mockImplementation(() => {
                return Promise.resolve("base64String")
            })
            const BasicKudoDto = await kudoMapper.toBasicKudoDto(kudo);

            expect(BasicKudoDto.id).toBeDefined();
            expect(BasicKudoDto.id).toBe(kudo.id);
            expect(BasicKudoDto.kudoImage).toBeDefined();
            expect(BasicKudoDto.kudoImage).toBe(kudo.imageUrl);
        })

        it('Get public kudo without Id and image', async () => {

            const kudo = new Kudo();
            jest.spyOn(imageService, "getImage").mockImplementation(() => {
                return Promise.resolve("base64String")
            })

            try {
                await kudoMapper.toBasicKudoDto(kudo);
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                const exc = e as InternalServerErrorException;
                expect(exc.message).toBe('Something went wrong getting your kudo')
            }
        })
    })

    describe('toDetailedKudoDto', () => {
        it('Get public kudo with sendDateTime, sender, receiver, event and image', async () => {
            const lennert = new User(uuid(), 'Lennert', 'Moorthamer', 'lennert.moorthamer@test.be')
            const tim = new User(uuid(), 'Tim', 'Francois', 'tim.francois@test.be');
            const tag = new Tag(uuid(), 'testTag');
            const event = new Event(uuid(), "titel1", true, new Date(), 'imageUrl', tag)
            const kudo = new Kudo(uuid(), "base64String", event, tim, lennert);

            jest.spyOn(imageService, "getImage").mockImplementation(() => {
                return Promise.resolve("base64String")
            })

            jest.spyOn(eventMapper, 'toEventDto').mockImplementationOnce(() => {
                return Promise.resolve(new EventDto(event.id!, event.title!, event.isMainEvent!, '18/11/1996', 'base64Image', tag.name))
            })

            const detailedKudoDto = await kudoMapper.toDetailedKudoDto(kudo);

            expect(detailedKudoDto.sendDateTime).toBeDefined();

            expect(detailedKudoDto.sender).toBeDefined();
            expect(detailedKudoDto.sender).toStrictEqual(UserMapper.toUserDto(kudo.sender!));

            expect(detailedKudoDto.receiver).toBeDefined();
            expect(detailedKudoDto.receiver).toStrictEqual(UserMapper.toUserDto(kudo.receiver!));

            expect(detailedKudoDto.event).toBeDefined();
            expect(detailedKudoDto.event!.id).toBe(event.id);
            expect(detailedKudoDto.event!.title).toBe(event.title);
            expect(detailedKudoDto.event!.isMainEvent).toBe(event.isMainEvent);
            expect(detailedKudoDto.event!.creationDate).toBe('18/11/1996');
            expect(detailedKudoDto.event!.eventImage).toBe('base64Image');
            expect(detailedKudoDto.event!.tagName).toBe(tag.name);

            expect(detailedKudoDto.kudoImage).toBeDefined();
            expect(detailedKudoDto.kudoImage).toBe(kudo.imageUrl);
        })

        it('Get public kudo with sendDateTime, sender, receiver and image, without event', async () => {
            const lennert = new User(uuid(), 'Lennert', 'Moorthamer', 'lennert.moorthamer@test.be')
            const tim = new User(uuid(), 'Tim', 'Francois', 'tim.francois@test.be');
            const kudo = new Kudo(uuid(), "base64String", undefined, tim, lennert);

            jest.spyOn(imageService, "getImage").mockImplementation(() => {
                return Promise.resolve("base64String")
            })

            const DetailedKudoDto = await kudoMapper.toDetailedKudoDto(kudo);

            expect(DetailedKudoDto.sendDateTime).toBeDefined();
            expect(DetailedKudoDto.sender).toBeDefined();
            expect(DetailedKudoDto.sender).toStrictEqual(UserMapper.toUserDto(kudo.sender!));
            expect(DetailedKudoDto.receiver).toBeDefined();
            expect(DetailedKudoDto.receiver).toStrictEqual(UserMapper.toUserDto(kudo.receiver!));
            expect(DetailedKudoDto.event).toBeUndefined();
            expect(DetailedKudoDto.kudoImage).toBeDefined();
            expect(DetailedKudoDto.kudoImage).toBe(kudo.imageUrl);
        })

        it('Get public kudo without sendDateTime, sender, receiver, event and image', async () => {

            const kudo = new Kudo();
            jest.spyOn(imageService, "getImage").mockImplementation(() => {
                return Promise.resolve("base64String")
            })

            try {
                await kudoMapper.toDetailedKudoDto(kudo);
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                const exc = e as InternalServerErrorException;
                expect(exc.message).toBe('Something went wrong getting your kudo')
            }
        })
    })
})