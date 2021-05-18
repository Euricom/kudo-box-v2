import { Test } from "@nestjs/testing"
import { AppConfigModule } from "../../../config/app-config.module"
import { Event } from "../../event/entities/event/event.entity"
import { EventService } from "../../event/service/event/event.service";
import { UserService } from "../../user/service/user.service";
import { Kudo } from "../entities/kudo.entity"
import { KudoService } from "./kudo.service"
import { v4 as uuid } from 'uuid';
import { User } from "../../user/entities/user.entity";
import { UserRepository } from "../../user/data-access/user.repository";
import { EventRepository } from "../../event/data-access/event/event.repository";
import { KudoRepository } from "../data-access/kudo.repository";
import { ImageClientService } from "../../../modules/image/service/image-client.service";
import { TagService } from "../../event/service/tag/tag.service";
import { ConfigService } from "@nestjs/config";
import { TagRepository } from "../../event/data-access/tag/tag.repository";
import { BadRequestException } from "@nestjs/common";

describe('KudoService', () => {
    let kudoService: KudoService;
    let eventService: EventService;
    let userService: UserService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppConfigModule],
            providers: [KudoService, EventService, UserService, UserRepository, KudoRepository, ImageClientService, TagService, EventRepository, ConfigService, TagRepository]
        }).compile();

        kudoService = await module.resolve(KudoService);
        eventService = await module.resolve(EventService);
        userService = await module.resolve(UserService);
    })

    describe('create', () => {
        it('public kudo without receiver and existing event should return created kudo - valid', async () => {
            const event = new Event(uuid());
            const sender = new User(uuid());
            const newKudo = new Kudo(undefined, 'example.com', event, sender, undefined);

            jest.spyOn(kudoService, 'createImageEntity')
                .mockResolvedValueOnce({ ...newKudo, id: uuid() } as Kudo)

            jest.spyOn(userService, 'userExists')
                .mockResolvedValueOnce(true);

            jest.spyOn(eventService, 'eventExists')
                .mockResolvedValueOnce(true);

            await kudoService.create(newKudo, {} as Express.Multer.File);

            expect(userService.userExists).toBeCalledTimes(1);
            expect(eventService.eventExists).toBeCalledTimes(1);
            expect(kudoService.createImageEntity).toBeCalled();
        })

        it('public kudo with receiver and existing event should return created kudo - valid', async () => {
            const event = new Event(uuid());
            const sender = new User(uuid());
            const receiver = new User(uuid());
            const newKudo = new Kudo(undefined, 'example.com', event, sender, receiver);

            jest.spyOn(kudoService, 'createImageEntity')
                .mockResolvedValueOnce({ ...newKudo, id: uuid() } as Kudo)

            jest.spyOn(userService, 'userExists')
                .mockResolvedValue(true);

            jest.spyOn(eventService, 'eventExists')
                .mockResolvedValueOnce(true);

            await kudoService.create(newKudo, {} as Express.Multer.File);

            expect(userService.userExists).toBeCalledTimes(2);
            expect(eventService.eventExists).toBeCalledTimes(1);
            expect(kudoService.createImageEntity).toBeCalled();
        })

        it('public kudo without receiver and without event should throw BadRequestException - invalid', async () => {
            const sender = new User(uuid());
            const newKudo = new Kudo(undefined, 'example.com', undefined, sender, undefined);

            try {
                await kudoService.create(newKudo, {} as Express.Multer.File);
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                const exc = e as BadRequestException;
                expect(exc.message).toBe('kudo must have an event or receiver')
            }
        })

        it('public kudo with receiver, event and non-existing sender should throw BadRequestException - invalid', async () => {
            const event = new Event(uuid());
            const sender = new User(uuid());
            const receiver = new User(uuid());
            const newKudo = new Kudo(undefined, 'example.com', event, sender, receiver);

            jest.spyOn(userService, 'userExists')
                .mockResolvedValue(false);

            try {
                await kudoService.create(newKudo, {} as Express.Multer.File);
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                const exc = e as BadRequestException;
                expect(exc.message).toBe(`Sender with id ${newKudo.sender!.id} does not exist`)

                expect(userService.userExists).toBeCalledTimes(1);
            }
        })

        it('public kudo with sender, event and non-existing receiver should throw BadRequestException - invalid', async () => {
            const event = new Event(uuid());
            const sender = new User(uuid());
            const receiver = new User(uuid());
            const newKudo = new Kudo(undefined, 'example.com', event, sender, receiver);

            jest.spyOn(userService, 'userExists').mockImplementation((id: string) => {
                if (sender.id === id) return Promise.resolve(true);
                if (receiver.id === id) return Promise.resolve(false);
                return Promise.resolve(true);
            });

            try {
                await kudoService.create(newKudo, {} as Express.Multer.File);
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                const exc = e as BadRequestException;
                expect(exc.message).toBe(`Receiver with id ${newKudo.receiver!.id} does not exist`)

                expect(userService.userExists).toBeCalledTimes(2);
            }
        })

        it('public kudo with sender, receiver and non-existing event should throw BadRequestException - invalid', async () => {
            const event = new Event(uuid());
            const sender = new User(uuid());
            const receiver = new User(uuid());
            const newKudo = new Kudo(undefined, 'example.com', event, sender, receiver);

            jest.spyOn(userService, 'userExists').mockResolvedValue(true);

            jest.spyOn(eventService, 'eventExists').mockResolvedValueOnce(false);

            try {
                await kudoService.create(newKudo, {} as Express.Multer.File);
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                const exc = e as BadRequestException;
                expect(exc.message).toBe(`Event with id ${newKudo.event!.id} does not exist`)

                expect(userService.userExists).toBeCalledTimes(2);
                expect(eventService.eventExists).toBeCalledTimes(1);
            }
        })

        it('private kudo with sender and receiver should return created kudo - invalid', async () => {
            const event = new Event(uuid());
            const sender = new User(uuid());
            const receiver = new User(uuid());
            const newKudo = new Kudo(undefined, 'example.com', undefined, sender, receiver);

            jest.spyOn(userService, 'userExists').mockResolvedValue(true);

            jest.spyOn(kudoService, 'createImageEntity')
                .mockResolvedValueOnce({ ...newKudo, id: uuid() } as Kudo)

            await kudoService.create(newKudo, {} as Express.Multer.File);

            expect(userService.userExists).toBeCalledTimes(2);
            expect(kudoService.createImageEntity).toBeCalled();
        })
    })
})