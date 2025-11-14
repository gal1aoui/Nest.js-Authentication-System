import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from '../services/authentication.service';
import { UserRole } from 'src/types/user';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: AuthenticationService;

  const mockUser = {
    email: 'test@test.com',
    password: 'Passw0rd',
    firstName: 'Test',
    lastName: 'User',
    role: 'DEVELOPER' as UserRole,
  };

  const mockToken = 'b16c660c5284aece';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('register', () => {
    it('should call authenticationService.register', async () => {
      (authService.register as jest.Mock).mockResolvedValue(mockToken);

      const result = await controller.register(mockUser);

      const {role, ...trimmedMockUser} = mockUser; // Exclude role for IUserCreate type

      expect(authService.register).toHaveBeenCalledWith(trimmedMockUser);
      expect(result).toBe(mockToken);
    });
  });

  describe('login', () => {
    it('should call authenticationService.login', async () => {
      const userCredentials = {
        email: mockUser.email,
        password: mockUser.password,
      };

      (authService.login as jest.Mock).mockResolvedValue(mockToken);

      const result = await controller.login(userCredentials);

      expect(authService.login).toHaveBeenCalledWith(userCredentials.email, userCredentials.password);
      expect(result).toBe(mockToken);
    });
  });
});
