import { Event } from "./event.entity"
import { Tag } from '../tag/tag.entity';
import { v4 as uuid } from 'uuid';

describe('Event', () => {
    describe('createTag', () => {
        it('create tag and add to existing tags of event - valid', () => {
            const existingTag = new Tag(undefined, 'acc', undefined);
            const event = new Event(undefined, undefined, undefined, undefined, undefined, [existingTag], undefined, undefined, undefined);

            const newTagName = 'rxjs';
            event.createTag(newTagName);

            expect(event.tags).toBeDefined();
            expect(event.tags!.length).toBe(1);
            expect.arrayContaining([
                expect.objectContaining({name: 'acc'}),
                expect.objectContaining({name: 'rxjs'})
            ])
        })

        it('create tag and add to event with no tags - valid', () => {
            const event = new Event(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);

            const newTagName = 'rxjs';
            event.createTag(newTagName);

            expect(event.tags).toBeDefined();
            expect(event.tags!.length).toBe(1);
            expect.arrayContaining([
                expect.objectContaining({name: newTagName})
            ])
        })
    })

    describe('assignMainEvent', () => {
        it('the child event should have a main event and tags of main event should be added to child event - valid', () => {
            const mainEventTag1 = new Tag(uuid(), 'devcruise2020', undefined);
            const mainEventTag2 = new Tag(uuid(), 'acc', undefined)
            const mainEvent = new Event(uuid(), 'Angular crash course', true, 'example.com', undefined, [mainEventTag1, mainEventTag2], undefined, undefined, undefined);

            const childEventTag = new Tag(undefined, 'rxjs', undefined);
            const childEvent = new Event(undefined, 'How to rxjs', false, 'example.be', undefined, [childEventTag], undefined, undefined, undefined);

            childEvent.assignMainEvent(mainEvent);

            expect(childEvent.mainEvent).toBeDefined();
            expect(childEvent.mainEvent).toMatchObject(mainEvent);
            expect(childEvent.tags).toBeDefined();
            expect(childEvent.tags!.length).toBe(3);
            expect(childEvent.tags!).toEqual(expect.arrayContaining([mainEventTag1, mainEventTag2, childEventTag]));
        })
    })
})