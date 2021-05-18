import { CreateEventDto } from "../dto/in/create-event/create-event.dto"
import { v4 as uuid } from 'uuid';
import { EventMapper } from "./event-mapper";
import { Tag } from "../../entities/tag/tag.entity";
import { Event } from "../../entities/event/event.entity";

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
})