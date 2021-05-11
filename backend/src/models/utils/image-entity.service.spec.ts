import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { KudoService } from '../kudo/service/kudo.service';
import { ImageClientService } from '../../modules/image/service/image-client.service';
import { KudoRepository } from '../kudo/data-access/kudo.repository';
import { AppConfigModule } from '../../config/app-config.module';
import { ImageEntityService } from './image-entity.service';
import { Repository } from 'typeorm';
import { ImageEntity } from './image-entity.entity';
import { v4 as uuid } from 'uuid';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

class ImageEntityServiceTestClass extends ImageEntityService<any> {
  constructor(imageClient: ImageClientService, repo: Repository<any>) {
    super(imageClient, repo)
  }
}

class ImageEntityTestClass extends ImageEntity {
  id?: string;
  constructor(id?: string, imageUrl?: string) {
    super(imageUrl);
    this.id = id;
  }
}

describe('ImageEntityService', () => {
  let imageEntityTestService: ImageEntityServiceTestClass;
  let imageClient: ImageClientService;
  let repo: Repository<ImageEntityTestClass>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [ImageClientService, ConfigService]
    }).compile();

    imageClient = module.get<ImageClientService>(ImageClientService);
    repo = new Repository();
    imageEntityTestService = new ImageEntityServiceTestClass(imageClient, repo);
  });

  describe('create', () => {
    it('Save ImageEntity - valid', async () => {
      let imageEntity = new ImageEntityTestClass(undefined, undefined);
      const imageUrl = 'example.com';
      const file: Express.Multer.File = {
        mimetype: 'image/png'
      } as Express.Multer.File;
      
  
      jest.spyOn(imageClient, 'saveImage').mockImplementationOnce(() => {
        return Promise.resolve(imageUrl);
      })

      jest.spyOn(ImageEntityServiceTestClass.prototype as any , 'generateFileNamePrefix').mockImplementation(() => {
        return 'test';
      })

      jest.spyOn(repo, 'save').mockImplementationOnce(() => {
        return Promise.resolve({...imageEntity, id: uuid()})
      })

      const createdImageEntity = await imageEntityTestService.createImageEntity(imageEntity, file);

      expect(createdImageEntity.id).toBeDefined();
      expect(createdImageEntity.imageUrl).toBe(imageUrl);
    });

    it('Save ImageEntity - no mimetype given - BadRequestException should be thrown', async () => {
      let imageEntity = new ImageEntityTestClass(undefined, undefined);
      const imageUrl = 'example.com';
      const file: Express.Multer.File = {} as Express.Multer.File;
      
      jest.spyOn(imageClient, 'saveImage').mockImplementationOnce(() => {
        return Promise.resolve(imageUrl);
      });
  
      try {
        await imageEntityTestService.createImageEntity(imageEntity, file);
        fail('Image should not be saved');
      } catch(e) {
        expect(e).toBeInstanceOf(BadRequestException);
        const exceptionInstance = e as BadRequestException;
        expect(exceptionInstance.message).toMatch('Could not create imageName or fileExtension');
      }
    })

    it('Save ImageEntity - faulty database connection - BadRequestException should be thrown', async () => {
      let imageEntity = new ImageEntityTestClass(undefined, undefined);
      const imageUrl = 'example.com';
      const file: Express.Multer.File = {
        mimetype: 'image/png'
      } as Express.Multer.File;
      
      jest.spyOn(imageClient, 'saveImage').mockImplementationOnce(() => {
        return Promise.resolve(imageUrl);
      });

      jest.spyOn(ImageEntityServiceTestClass.prototype as any , 'generateFileNamePrefix').mockImplementation(() => {
        return 'test';
      })

      jest.spyOn(imageClient, 'deleteImage').mockImplementationOnce(() => {
        return Promise.resolve();
      })

      jest.spyOn(repo, 'save').mockImplementationOnce(() => {
        throw new Error();
      })
  
      try {
        await imageEntityTestService.createImageEntity(imageEntity, file);
        fail('Image should not be saved');
      } catch(e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        const exceptionInstance = e as InternalServerErrorException;
        expect(exceptionInstance.message).toMatch('Something went wrong saving your kudo');
      }
    })
  })
});
