import { CreateEventDto } from "../dto/in/create-event/create-event.dto"
import { v4 as uuid } from 'uuid';
import { EventMapper } from "./event-mapper";
import { Event } from "../../entities/event/event.entity";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { Tag } from "../../entities/tag/tag.entity";
import { Test } from "@nestjs/testing";
import { ImageClientService } from "../../../../modules/image/service/image-client.service";

describe('EventMapper', () => {
    let eventMapper: EventMapper;
    let imageService: ImageClientService;

    beforeEach(async () => {
        const testModule = await Test.createTestingModule({
            providers: [
                EventMapper,
                {
                    provide: ImageClientService,
                    useValue: {
                        getImage: jest.fn()
                    }
                }
            ]
        }).compile();

        eventMapper = testModule.get<EventMapper>(EventMapper);
        imageService = testModule.get<ImageClientService>(ImageClientService);
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
})