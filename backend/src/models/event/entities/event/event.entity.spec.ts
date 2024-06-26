import { Event } from "./event.entity"
import { Tag } from '../tag/tag.entity';
import { v4 as uuid } from 'uuid';

describe('Event', () => {
    describe('createTag', () => {
        it('create tag and add to existing tags of event - valid', () => {
            const existingTag = new Tag(undefined, 'acc', undefined);
            const event = new Event(undefined, undefined, undefined, undefined, undefined, undefined, undefined, [existingTag], undefined, undefined);

            const newTagName = 'rxjs';
            event.createTag(newTagName);

            expect(event.tags).toBeDefined();
            expect(event.tags!.length).toBe(1);
            expect(event.ownedTag).toBeDefined();
            expect(event.ownedTag?.name).toBe(newTagName);
            expect.arrayContaining([
                expect.objectContaining({ name: 'acc' }),
            ])
        })

        it('create tag and add to event with no tags - valid', () => {
            const event = new Event(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);

            const newTagName = 'rxjs';
            event.createTag(newTagName);

            expect(event.tags).toBeUndefined();
            expect(event.ownedTag).toBeDefined();
            expect(event.ownedTag?.name).toBe(newTagName);
        })
    })

    describe('assignMainEvent', () => {
        it('the child event should have a main event and tags of main event should be added to child event - valid', () => {
            const mainEventTag1 = new Tag(uuid(), 'devcruise2020', undefined);
            const ownedTagMainEvent = new Tag(uuid(), 'acc', undefined)
            const mainEvent = new Event(uuid(), 'Angular crash course', true, new Date(), 'example.com', ownedTagMainEvent, undefined, [mainEventTag1], undefined, undefined, undefined);

            const childEventOwnedTag = new Tag(undefined, 'rxjs', undefined);
            const childEvent = new Event(undefined, 'How to rxjs', false, new Date(), 'example.be', childEventOwnedTag, undefined, undefined, undefined, undefined);

            childEvent.assignMainEvent(mainEvent);

            expect(childEvent.mainEvent).toBeDefined();
            expect(childEvent.creationDate).toBeDefined();
            expect(childEvent.mainEvent).toMatchObject(mainEvent);
            expect(childEvent.tags).toBeDefined();
            expect(childEvent.tags!.length).toBe(2);
            expect(childEvent.tags!).toEqual(expect.arrayContaining([mainEventTag1, ownedTagMainEvent]));
        })
    })
})