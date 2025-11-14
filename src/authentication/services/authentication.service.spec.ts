import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    _id: '1',
    email: 'test@test.com',
    password: 'Passw0rd',
    firstName: 'Test',
    lastName: 'User',
    role: 'DEVELOPER',
  };

  const mockToken = 'b16c660c5284aece';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            getUserById: jest.fn(),
            validateUser: jest.fn(),
            updateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should create user and return token', async () => {
      (usersService.createUser as jest.Mock).mockResolvedValue(mockUser);
      (usersService.getUserById as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await service.register(mockUser);

      expect(usersService.createUser).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('accessToken', mockToken);
    });
  });

  describe('login', () => {
    it('should validate user credentials and return token', async () => {
      (usersService.validateUser as jest.Mock).mockResolvedValue(mockUser);
      (usersService.getUserById as jest.Mock).mockResolvedValue(mockUser);
      (usersService.updateUser as jest.Mock).mockResolvedValue({});
      (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await service.login(mockUser.email, mockUser.password);
      
      expect(result.success).toBe(true);
      expect(result).toHaveProperty('accessToken', mockToken);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      (usersService.validateUser as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login('invalid@test.com', '123' ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
