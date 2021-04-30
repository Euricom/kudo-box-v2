import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '../../../config/app-config.module';
import { KudoRepository } from '../data-access/kudo-repository';
import { Kudo } from '../entities/kudo.entity';
import { ImageClientService } from './image-client.service';
import { KudoService } from './kudo.service';
import { v4 as uuid } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';

describe('KudoService', () => {
  let kudoService: KudoService;
  let imageClient: ImageClientService;
  let kudoRepo: KudoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [KudoService, KudoRepository, ImageClientService, ConfigService],
    }).compile();

    kudoService = module.get<KudoService>(KudoService);
    imageClient = module.get<ImageClientService>(ImageClientService);
    kudoRepo = module.get<KudoRepository>(KudoRepository);
  });

  it('Save kudo valid', async () => {
    const imageUrl = 'example.com';
    const toBeSavedKudo = new Kudo(uuid(), uuid(), imageUrl);
    
    jest.spyOn(imageClient, 'saveImage').mockImplementationOnce((_) => {
      return Promise.resolve(imageUrl)
    });

    jest.spyOn(kudoRepo, 'save').mockImplementationOnce((kudo: Kudo) => {
      const savedKudo = toBeSavedKudo;
      savedKudo.id = uuid();
      return Promise.resolve(savedKudo);
    })

    const savedKudo = await kudoService.create(toBeSavedKudo, null)
    expect(savedKudo.id).toBeDefined();
    expect(savedKudo.imageUrl).toBe(toBeSavedKudo.imageUrl);
    expect(savedKudo.receiverId).toBe(toBeSavedKudo.receiverId);
    expect(savedKudo.senderId).toMatch(toBeSavedKudo.senderId);
    expect(savedKudo.sendDateTime.toString()).toMatch(toBeSavedKudo.sendDateTime.toString());

  });

  it('Save kudo DB exception', () => {
    const imageUrl = 'example.com';
    const toBeSavedKudo = new Kudo(uuid(), uuid(), imageUrl);
    
    jest.spyOn(imageClient, 'saveImage').mockImplementationOnce((_) => {
      return Promise.resolve(imageUrl)
    });

    jest.spyOn(imageClient, 'deleteImage').mockImplementationOnce((_) => {
      return Promise.resolve();
    })

    jest.spyOn(kudoRepo, 'save').mockImplementationOnce((kudo: Kudo) => {
      return Promise.reject()
    })

    expect(kudoService.create(toBeSavedKudo, null)).rejects.toThrow(InternalServerErrorException);
  })
});
