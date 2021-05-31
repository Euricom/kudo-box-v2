import { Test, TestingModule } from "@nestjs/testing"
import { Event } from "../../event/entities/event/event.entity"
import { UserService } from "../../user/service/user.service";
import { Kudo } from "../entities/kudo.entity"
import { KudoService } from "./kudo.service"
import { v4 as uuid } from 'uuid';
import { User } from "../../user/entities/user.entity";
import { ImageClientService } from "../../../modules/image/service/image-client.service";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { EventService } from "../../event/service/event/event.service";
import { KudoRepository } from "../data-access/kudo.repository";
import { EventEmitter2 } from "eventemitter2";
import { ConfigService } from "@nestjs/config";

describe('KudoService', () => {
    let kudoService: KudoService;
    let eventService: EventService;
    let userService: UserService;
    let kudoRepository: KudoRepository;
    let eventEmitter: EventEmitter2;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KudoService,
                {
                    provide: EventService,
                    useValue: {
                        eventExists: jest.fn()
                    }
                },
                {
                    provide: UserService,
                    useValue: {
                        userExists: jest.fn()
                    }
                },
                {
                    provide: KudoRepository,
                    useValue: {
                        findKudos: jest.fn(),
                        findKudosFiltered: jest.fn(),
                        findKudo: jest.fn()
                    }
                },
                {
                    provide: ImageClientService,
                    useValue: {}
                },
                {
                    provide: EventEmitter2,
                    useValue: {
                        emit: jest.fn()
                    }
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(() => 'kudo-created')
                    }
                }
            ]
        }).compile();

        kudoService = module.get<KudoService>(KudoService);
        eventService = module.get<EventService>(EventService);
        userService = module.get<UserService>(UserService);
        kudoRepository = module.get<KudoRepository>(KudoRepository);
        eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    })

    describe('create', () => {
        it('public kudo without receiver and existing event should return created kudo - valid', async () => {
            const event = new Event(uuid());
            const sender = new User(uuid());
            const kudoId = uuid();
            const newKudo = new Kudo(undefined, 'example.com', event, sender, undefined);

            jest.spyOn(kudoService, 'createImageEntity')
                .mockResolvedValueOnce({ ...newKudo, id: kudoId } as Kudo)

            jest.spyOn(userService, 'userExists')
                .mockResolvedValueOnce(true);

            jest.spyOn(eventService, 'eventExists')
                .mockResolvedValueOnce(true);

            jest.spyOn(eventEmitter, 'emit').mockImplementationOnce((eventName, payload): boolean => {
                expect(eventName).toBe('kudo-created');
                expect(payload.id).toBe(kudoId);

                return true;
            })

            await kudoService.create(newKudo, {} as Express.Multer.File);

            expect(userService.userExists).toBeCalledTimes(1);
            expect(eventService.eventExists).toBeCalledTimes(1);
            expect(kudoService.createImageEntity).toBeCalled();
            expect(eventEmitter.emit).toBeCalledTimes(1);
        })

        it('public kudo with receiver and existing event should return created kudo - valid', async () => {
            const event = new Event(uuid());
            const sender = new User(uuid());
            const receiver = new User(uuid());
            const kudoId = uuid();
            const newKudo = new Kudo(undefined, 'example.com', event, sender, receiver);

            jest.spyOn(kudoService, 'createImageEntity')
                .mockResolvedValueOnce({ ...newKudo, id: kudoId } as Kudo)

            jest.spyOn(userService, 'userExists')
                .mockResolvedValue(true);

            jest.spyOn(eventService, 'eventExists')
                .mockResolvedValueOnce(true);

            jest.spyOn(eventEmitter, 'emit').mockImplementationOnce((eventName, payload): boolean => {
                expect(eventName).toBe('kudo-created');
                expect(payload.id).toBe(kudoId);

                return true;
            })

            await kudoService.create(newKudo, {} as Express.Multer.File);

            expect(userService.userExists).toBeCalledTimes(2);
            expect(eventService.eventExists).toBeCalledTimes(1);
            expect(kudoService.createImageEntity).toBeCalled();
            expect(eventEmitter.emit).toBeCalledTimes(1);
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
                expect(eventEmitter.emit).toBeCalledTimes(0);
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
                expect(eventEmitter.emit).toBeCalledTimes(0);
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
                expect(eventEmitter.emit).toBeCalledTimes(0);
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
                expect(eventEmitter.emit).toBeCalledTimes(0);
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
            expect(eventEmitter.emit).toBeCalledTimes(0);
        })
    })

    describe('getKudos', () => {
        it('get all kudos without filter should call findKudos of KudoRepository', async () => {
            await kudoService.getKudos(undefined);

            expect(kudoRepository.findKudos).toBeCalledTimes(1);
            expect(kudoRepository.findKudosFiltered).toBeCalledTimes(0);
        })

        it('get all kudos with filter should call findKudosFiltered of KudoRepository', async () => {
            await kudoService.getKudos('test');

            expect(kudoRepository.findKudos).toBeCalledTimes(0);
            expect(kudoRepository.findKudosFiltered).toBeCalledTimes(1);
        })
    })

    describe('delete', () => {

        it('delete kudo check when kudo not found', async () => {
            jest.spyOn(kudoRepository, 'findKudo').mockResolvedValue(undefined);
            try {
                await kudoService.delete("not found id", "4e636f54-841d-4967-a6a5-ba922e7235ea");
                fail('BadRequestException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                const exc = e as BadRequestException;
                expect(exc.message).toBe(`Kudo with id not found id not found`)
            }
        })

        it('delete kudo check when user not authorized', async () => {
            const lennert = new User('4e636f54-841d-4967-a6a5-ba922e7235ea', 'Lennert', 'Moorthamer', 'lennert@euri.com', undefined, undefined, undefined);
            jest.spyOn(kudoRepository, 'findKudo').mockResolvedValue(new Kudo('13da402d-6a6f-4daa-a0ff-2b608412cdaa', 'https://ekudos.blob.core.windows.net/ekudo-dev/kudo-34bed51a-d5d4-4d5f-a23b-5babccdd51fd.webp', undefined, lennert, lennert));
            try {
                await kudoService.delete("13da402d-6a6f-4daa-a0ff-2b608412cdaa", "not authorized id");
                fail('UnauthorizedException should be thrown');
            } catch (e) {
                expect(e).toBeInstanceOf(UnauthorizedException);
                const exc = e as UnauthorizedException;
                expect(exc.message).toBe(`You are not authorized to delete this kudo`)
            }
        })
    })

})