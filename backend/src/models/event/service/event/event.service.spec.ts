import { Test, TestingModule } from '@nestjs/testing';
import { ImageClientService } from '../../../../modules/image/service/image-client.service';
import { EventRepository } from '../../data-access/event.repository';
import { TagRepository } from '../../../tag/data-access/tag.repository';
import { Event } from '../../entities/event.entity';
import { TagService } from '../../../tag/service/tag.service';
import { EventService } from './event.service';
import { v4 as uuid } from 'uuid';
import { Tag } from '../../../tag/entities/tag.entity';
import { User } from '../../../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from '../../../../config/app-config.module';
import { BadRequestException } from '@nestjs/common';

describe('EventService', () => {
  let eventService: EventService;
  let tagService: TagService;
  let eventRepo: EventRepository;
  let imageClient: ImageClientService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [EventService, TagService, EventRepository, ImageClientService, TagRepository, ConfigService],
    }).compile();

    eventService = module.get<EventService>(EventService);
    tagService = module.get<TagService>(TagService);
    eventRepo = module.get<EventRepository>(EventRepository);
    imageClient = module.get<ImageClientService>(ImageClientService);
  });

  describe('create', () => {
    it('create event without main event and non-existing tagName should return valid event - valid', async () => {
      let newTag = new Tag(undefined, 'acc', undefined);
      const newEvent = new Event(undefined, 'Angular crash course', undefined, undefined, undefined, undefined, undefined, undefined, undefined);

      jest.spyOn(tagService, 'tagNameExists').mockImplementationOnce(() => {
        return Promise.resolve(false)
      });

      jest.spyOn(eventService, 'createImageEntity').mockImplementationOnce(() => {
        newTag = {...newTag, id: uuid()}
        const createdEvent: Event = { ...newEvent, id: uuid(), tags: [newTag], imageUrl: 'example.com' } as Event;

        return Promise.resolve(createdEvent)
      })

      const createdEvent = await eventService.create(newEvent, {} as Express.Multer.File, newTag.name!, undefined);

      expect(createdEvent.id).toBeDefined();
      expect(createdEvent.imageUrl).toBeDefined();
      expect(createdEvent.imageUrl).toMatch('example.com');

      expect(createdEvent.tags).toBeDefined();
      expect(createdEvent.tags!.length).toBe(1);
      expect(createdEvent.tags).toEqual(expect.arrayContaining([newTag]))

      expect(createdEvent.mainEvent).toBeUndefined();
    })

    it('create event with main event and non-existing tagName should return valid event - valid', async () => {
      let newTag = new Tag(undefined, 'acc', undefined);
      const newEvent = new Event(undefined, 'Angular crash course', undefined, undefined, undefined, undefined, undefined, undefined);

      const mainEventTag = new Tag(uuid(), 'dc2020', undefined);
      const mainEvent = new Event(uuid(), 'devcruise2020', undefined, undefined, undefined, [mainEventTag], undefined, undefined, undefined);

      jest.spyOn(tagService, 'tagNameExists').mockImplementationOnce(() => {
        return Promise.resolve(false)
      });

      jest.spyOn(eventRepo, 'findByIdIncludingTags').mockImplementationOnce(() => {
        return Promise.resolve(mainEvent);
      })

      jest.spyOn(eventService, 'createImageEntity').mockImplementationOnce(() => {
        newTag = {...newTag, id: uuid()} as Tag
        const createdEvent: Event = { ...newEvent, id: uuid(), tags: [newTag, ...mainEvent.tags!], mainEvent: mainEvent, imageUrl: 'example.com' } as Event;

        return Promise.resolve(createdEvent)
      })

      const createdEvent = await eventService.create(newEvent, {} as Express.Multer.File, newTag.name!, mainEvent.id);

      expect(createdEvent.id).toBeDefined();
      expect(createdEvent.imageUrl).toBeDefined();
      expect(createdEvent.imageUrl).toMatch('example.com');

      expect(createdEvent.tags!.length).toBe(2);
      expect(createdEvent.tags).toEqual(expect.arrayContaining([newTag, mainEventTag]))

      expect(createdEvent.mainEvent).toBeDefined();
      expect(createdEvent.mainEvent).toMatchObject(mainEvent);
    })

    it('create event with existing tagName should throw BadRequestException - invalid', async () => {
      const newEvent = new Event(undefined, 'Angular crash course', undefined, undefined, undefined, undefined, undefined, undefined);

      jest.spyOn(tagService, 'tagNameExists').mockImplementationOnce(() => {
        return Promise.resolve(true);
      })

      try {
        await eventService.create(newEvent, {} as Express.Multer.File, 'random tag name', undefined);
      } catch(e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const exception = e as BadRequestException;
        expect(exception.message).toBe('Given tag already exists');
      }
    })

    it('create child event with non-existant main event id should throw BadRequestException - invalid', async () => {
      const newEvent = new Event(undefined, 'Angular crash course', undefined, undefined, undefined, undefined, undefined, undefined, undefined);
      const mainEvent = new Event(uuid(), 'devcruise2020', undefined, undefined, [], undefined, undefined, undefined, undefined, undefined);

      jest.spyOn(tagService, 'tagNameExists').mockImplementationOnce(() => {
        return Promise.resolve(false)
      });

      jest.spyOn(eventRepo, 'findByIdIncludingTags').mockImplementationOnce(() => {
        return Promise.resolve(undefined);
      })

      try {
        await eventService.create(newEvent, {} as Express.Multer.File, 'random tag name', mainEvent.id);
      } catch(e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const exception = e as BadRequestException;
        expect(exception.message).toBe(`Main event with id ${mainEvent.id} not found`);
      }
    })
  })
});
