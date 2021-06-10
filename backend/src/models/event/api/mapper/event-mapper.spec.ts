import { CreateEventDto } from "../dto/in/create-event/create-event.dto"
import { v4 as uuid } from 'uuid';
import { EventMapper } from "./event-mapper";
import { Event } from "../../entities/event/event.entity";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { Tag } from "../../entities/tag/tag.entity";
import { Test } from "@nestjs/testing";
import { ImageClientService } from "../../../../modules/image/service/image-client.service";
import { KudoMapper } from "../../../kudo/api/mapper/kudo-mapper";
import { User } from "../../../user/entities/user.entity";
import { Kudo } from "../../../kudo/entities/kudo.entity";
import { BasicKudoDto } from "../../../kudo/api/dto/out/BasicKudo.dto";

describe('EventMapper', () => {
    let eventMapper: EventMapper;
    let imageService: ImageClientService;
    let kudoMapper: KudoMapper;

    beforeEach(async () => {
        const testModule = await Test.createTestingModule({
            providers: [
                EventMapper,
                {
                    provide: ImageClientService,
                    useValue: {
                        getImage: jest.fn()
                    }
                },
                {
                    provide: KudoMapper,
                    useValue: {
                        toBasicKudoDto: jest.fn()
                    }
                }
            ]
        }).compile();

        eventMapper = testModule.get<EventMapper>(EventMapper);
        imageService = testModule.get<ImageClientService>(ImageClientService);
        kudoMapper = testModule.get<KudoMapper>(KudoMapper);
    })

    describe('fromCreateEventDto', () => {
        it('it should return an Event - valid', () => {
            const createEventDto = new CreateEventDto('A title', {} as Express.Multer.File, 'true', 'new tag', undefined);

            const eventToCreate = EventMapper.fromCreateEventDto(createEventDto);

            expect(eventToCreate).toBeDefined();
            expect(eventToCreate.id).toBeUndefined();
            expect(eventToCreate.host).toBeUndefined();
            expect(eventToCreate.isMainEvent).toBe(true);
            expect(eventToCreate.title).toBe(createEventDto.title);
            expect(eventToCreate.mainEvent).toBeUndefined();
        })
    })

    describe('toDropDownEventDto', () => {
        it('it should return a DropDownEventDto', () => {
            const event = new Event(uuid(), 'Event 1', true, new Date(), 'example.com', undefined, undefined, undefined, undefined, undefined);

            const eventDropDownDto = EventMapper.toDropDownEventDto(event);

            expect(eventDropDownDto).toBeDefined();
            expect(eventDropDownDto.id).toBe(event.id);
            expect(eventDropDownDto.title).toBe(event.title);
        })
    })

    describe('toEventDto', () => {
        it('Event with Id, firstname, lastname and email', async () => {
            const testTag = new Tag(uuid(), 'rxjs')
            const testEvent = new Event(uuid(), 'How to Rxjs', true, new Date(), 'example.com', testTag);

            jest.spyOn(imageService, 'getImage').mockResolvedValueOnce('base64Image');

            const eventDto = await eventMapper.toEventDto(testEvent);

            expect(eventDto.id).toBeDefined();
            expect(eventDto.id).toBe(testEvent.id);
            expect(eventDto.title).toBeDefined();
            expect(eventDto.title).toBe(testEvent.title);
            expect(eventDto.isMainEvent).toBeDefined();
            expect(eventDto.isMainEvent).toBe(testEvent.isMainEvent);
            expect(eventDto.creationDate).toBeDefined();
            expect(eventDto.tagName).toBeDefined();
            expect(eventDto.tagName).toBe(testEvent.ownedTag?.name);
            expect(eventDto.eventImage).toBe('base64Image');
        })

        it('Event without data', async () => {
            const testEvent = new Event();

            try {
                await eventMapper.toEventDto(testEvent);
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                const exc = e as InternalServerErrorException;
                expect(exc.message).toBe('Something went wrong getting your event')
            }
        })
    })

    describe('toEventRoomDto', () => {
        it('It should return an EventRoomDto', async () => {
            const tag = new Tag(uuid(), 'tag');
            const host = new User(uuid(), 'Tim', 'François');
            const kudos = [new Kudo(), new Kudo()];
            const event = new Event(uuid(), 'event name', false, undefined, 'eventBase64Image', tag, kudos, undefined, host);

            jest.spyOn(kudoMapper, 'toBasicKudoDto').mockImplementation(() => {
                return Promise.resolve(new BasicKudoDto(uuid(), 'kudoBase64Image'));
            })

            const eventRoomDto = await eventMapper.toEventRoomDto(event);

            expect(eventRoomDto.eventRoomInfo.firstnameHost).toBe(host.firstname);
            expect(eventRoomDto.eventRoomInfo.lastnameHost).toBe(host.lastname);
            expect(eventRoomDto.eventRoomInfo.tagName).toBe(tag.name);
            expect(eventRoomDto.eventRoomInfo.title).toBe(event.title);

            expect(eventRoomDto.kudos).toBeDefined();
            expect(eventRoomDto.kudos!.length).toBe(kudos.length);
        })

        it('Kudos undefined - it should throw InternalServerError', async () => {
            const tag = new Tag(uuid(), 'tag');
            const host = new User(uuid(), 'Tim', 'François');
            const kudos = undefined;
            const event = new Event(uuid(), 'event name', false, undefined, 'eventBase64Image', tag, kudos, undefined, host);

            try {
                const eventRoomDto = await eventMapper.toEventRoomDto(event);
                fail('InternalServerError should be thrown')
            } catch(e) {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                const error = e as InternalServerErrorException;
                expect(error.message).toBe('Kudos of event should be defined');
            }
        })

        it('Event no ownedTag - it should throw InternalServerError', async () => {
            const tag = undefined
            const host = new User(uuid(), 'Tim', 'François');
            const kudos = [new Kudo(), new Kudo()];
            const event = new Event(uuid(), 'event name', false, undefined, 'eventBase64Image', tag, kudos, undefined, host);

            try {
                const eventRoomDto = await eventMapper.toEventRoomDto(event);
                fail('InternalServerError should be thrown')
            } catch(e) {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                const error = e as InternalServerErrorException;
                expect(error.message).toBe('OwnedTag of event should be defined');
            }
        })

        it('Event no host - it should throw InternalServerError', async () => {
            const tag = new Tag(uuid(), 'tag');
            const host = undefined;
            const kudos = [new Kudo(), new Kudo()];
            const event = new Event(uuid(), 'event name', false, undefined, 'eventBase64Image', tag, kudos, undefined, host);

            try {
                const eventRoomDto = await eventMapper.toEventRoomDto(event);
                fail('InternalServerError should be thrown')
            } catch(e) {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                const error = e as InternalServerErrorException;
                expect(error.message).toBe('Host of event should be defined');
            }
        })
    })
})