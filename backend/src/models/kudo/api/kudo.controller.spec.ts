import { Test, TestingModule } from '@nestjs/testing';
import { KudoController } from './kudo.controller';
import { KudoService } from '../service/kudo.service';

describe('KudoController', () => {
  let controller: KudoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KudoController],
      providers: [KudoService],
    }).compile();

    controller = module.get<KudoController>(KudoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
