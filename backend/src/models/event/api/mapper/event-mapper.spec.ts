import { CreateEventDto } from "../dto/in/create-event/create-event.dto"
import { v4 as uuid } from 'uuid';
import { EventMapper } from "./event-mapper";
import { Event } from "../../entities/event/event.entity";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { Tag } from "../../entities/tag/tag.entity";


describe('EventMapper', () => {
    describe('fromCreateEventDto', () => {
        it('it should return an Event - valid', () => {
            const createEventDto = new CreateEventDto('A title', {} as Express.Multer.File, 'true', uuid(), 'new tag', undefined);

            const eventToCreate = EventMapper.fromCreateEventDto(createEventDto);

            expect(eventToCreate).toBeDefined();
            expect(eventToCreate.id).toBeUndefined();
            expect(eventToCreate.host).toBeDefined();
            expect(eventToCreate.host!.id).toBe(createEventDto.hostId);
            expect(eventToCreate.isMainEvent).toBe(true);
            expect(eventToCreate.title).toBe(createEventDto.title);
            expect(eventToCreate.mainEvent).toBeUndefined();
        })
    })

    describe('toDropDownEventDto', () => {
        it('it should return a DropDownEventDto', () => {
            const event = new Event(uuid(), 'Event 1', true, 'example.com', undefined, undefined, undefined, undefined, undefined);

            const eventDropDownDto = EventMapper.toDropDownEventDto(event);

            expect(eventDropDownDto).toBeDefined();
            expect(eventDropDownDto.id).toBe(event.id);
            expect(eventDropDownDto.title).toBe(event.title);
        })
    })

    describe('toEventDto', () => {
        it('Event with Id, firstname, lastname and email', async () => {
            const testTag = new Tag(uuid(), 'rxjs')
            const testEvent = new Event(uuid(), 'How to Rxjs', true, 'example.com', testTag);
    
            const EventDto = EventMapper.toEventDto(testEvent);

            expect(EventDto.id).toBeDefined();
            expect(EventDto.id).toBe(testEvent.id);
            expect(EventDto.title).toBeDefined();
            expect(EventDto.title).toBe(testEvent.title);
            expect(EventDto.isMainEvent).toBeDefined();
            expect(EventDto.isMainEvent).toBe(testEvent.isMainEvent);
            expect(EventDto.tagName).toBeDefined();
            expect(EventDto.tagName).toBe(testEvent.ownedTag?.name);
        })

        it('Event without data', async () => {
            const testEvent = new Event();

            try {
                await EventMapper.toEventDto(testEvent);
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(InternalServerErrorException);
                const exc = e as InternalServerErrorException;
                expect(exc.message).toBe('Something went wrong getting your event')
            }
        })
    })
})