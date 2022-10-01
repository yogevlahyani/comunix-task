import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../src/app.service';
import { AppGateway } from '../src/app.gateway';
import { AuthService } from '../src/auth/auth.service';

describe('AppGateway', () => {
  let gateway: AppGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppGateway,
        { provide: AppService, useValue: jest.fn },
        { provide: AuthService, useValue: jest.fn },
      ],
    }).compile();

    gateway = module.get<AppGateway>(AppGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
