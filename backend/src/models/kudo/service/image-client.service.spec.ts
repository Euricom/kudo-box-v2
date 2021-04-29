import { Test, TestingModule } from '@nestjs/testing';
import { ImageClientService } from './image-client.service';

describe('ImageClientService', () => {
  let service: ImageClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageClientService],
    }).compile();

    service = module.get<ImageClientService>(ImageClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
