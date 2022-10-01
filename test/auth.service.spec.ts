import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'tests' })],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    jest.spyOn(jwtService, 'sign');
    jest.spyOn(jwtService, 'decode');
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Create Temporary Token', () => {
    it('should create a jwt token', () => {
      const token = authService.createTempToken();

      expect(token).toMatch(/^[\w-]*\.[\w-]*\.[\w-]*$/);
    });

    it('should call jwt service with sign method', () => {
      authService.createTempToken();

      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });
  });

  describe('Decode Temporary Token', () => {
    let token: string;

    beforeAll(() => {
      token = authService.createTempToken();
    });

    it('should decode a jwt token', () => {
      const payload = authService.decodeTempToken(token);

      expect(payload).toHaveProperty('sub');
    });

    it('should call jwt service with decode method', () => {
      authService.decodeTempToken(token);

      expect(jwtService.decode).toHaveBeenCalledTimes(1);
    });
  });
});
