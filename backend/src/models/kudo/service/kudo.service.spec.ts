import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '../../../config/app-config.module';
import { KudoRepository } from '../data-access/kudo.repository';
import { Kudo } from '../entities/kudo.entity';
import { ImageClientService } from '../../../modules/image/service/image-client.service';
import { KudoService } from './kudo.service';
import { v4 as uuid } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

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

  describe('create', () => {
    it('Save kudo - valid', async () => {
      const imageUrl = 'example.com';
      const sender = new User(uuid());
      const receiver = new User(uuid())
      const toBeSavedKudo = new Kudo(undefined, imageUrl, undefined, sender, receiver);
      
      jest.spyOn(imageClient, 'saveImage').mockImplementationOnce(() => {
        return Promise.resolve(imageUrl)
      });
  
      jest.spyOn(kudoRepo, 'save').mockImplementationOnce(() => {
        const savedKudo = toBeSavedKudo;
        savedKudo.id = uuid();
        return Promise.resolve(savedKudo);
      })
  
      const savedKudo = await kudoService.createImageEntity(toBeSavedKudo, {} as Express.Multer.File)
      expect(savedKudo.id).toBeDefined();
      expect(savedKudo.imageUrl).toBe(toBeSavedKudo.imageUrl);
      expect(savedKudo.sender).toBeDefined();
      expect(savedKudo.receiver).toBeDefined();
      expect(savedKudo.sender!.id).toBe(toBeSavedKudo.sender!.id?.toString());
      expect(savedKudo.receiver!.id).toBe(toBeSavedKudo.receiver!.id);
      expect(savedKudo.sendDateTime).toBeDefined();
      expect(savedKudo.sendDateTime!.toString()).toMatch(toBeSavedKudo.sendDateTime!.toString());
  
    });

    it('Save kudo - database connection problem - InternalServerException should be thrown', async () => {
      const imageUrl = 'example.com';
      const sender = new User(uuid());
      const receiver = new User(uuid())
      const toBeSavedKudo = new Kudo(undefined, imageUrl, undefined, sender, receiver);
      
      jest.spyOn(imageClient, 'saveImage').mockImplementationOnce(() => {
        throw new InternalServerErrorException(null, 'Something went wrong saving your kudo');
      });
  
      jest.spyOn(imageClient, 'deleteImage').mockImplementationOnce(() => {
        return Promise.resolve();
      })
  
      jest.spyOn(kudoRepo, 'save').mockImplementationOnce(() => {
        return Promise.reject()
      })
  
  
      try {
        await kudoService.createImageEntity(toBeSavedKudo, {} as Express.Multer.File);
        fail('Kudo should not be created in this case');
      } catch(e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        const exceptionInstance = e as InternalServerErrorException;
        expect(exceptionInstance.message).toMatch('Something went wrong saving your kudo');
      }
    })
  })
});
