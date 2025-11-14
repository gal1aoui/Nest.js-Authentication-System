import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRole, UserStatus } from 'src/types/user';
import { UsersRepository } from '../repositories/users.repository';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;

  const mockUser = {
    _id: '1',
    email: 'test@test.com',
    passwordHash: 'hashed',
    firstName: 'Test',
    lastName: 'User',
    role: 'DEVELOPER' as UserRole,
    status: UserStatus.ACTIVE,
  };

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);

    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    (usersRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
    (usersRepository.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.createUser({
      email: mockUser.email,
      password: 'Passw0rd',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.DEVELOPER,
    });

    expect(usersRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(usersRepository.create).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should return user without passwordHash when getting by ID', async () => {
    (usersRepository.findById as jest.Mock).mockResolvedValue(mockUser);

    const { passwordHash, ...expectedUser } = mockUser;

    const result = await service.getUserById('1');

    expect(usersRepository.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(expectedUser);
  });

  it('should update user and return user without passwordHash', async () => {
    const updatedUser = { ...mockUser, lastName: 'Updated' };
    (usersRepository.update as jest.Mock).mockResolvedValue(updatedUser);

    const { passwordHash, ...expectedUser } = updatedUser;

    const result = await service.updateUser('1', { lastName: 'Updated' });

    expect(usersRepository.update).toHaveBeenCalledWith('1', { lastName: 'Updated' });
    expect(result).toEqual(expectedUser);
  });

  it('should validate user credentials', async () => {
    (usersRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.validateUser('test@test.com', 'Passw0rd');

    expect(usersRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(result).toBe(mockUser);
  });

  it('should throw error for invalid password', async () => {
    (usersRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.validateUser('test@test.com', 'wrong'),
    ).rejects.toThrow('Invalid credentials');
  });

  it('should filter users by role', async () => {
    const users = [
      { ...mockUser, role: UserRole.DEVELOPER },
      { ...mockUser, role: UserRole.SUPERVISOR },
    ];

    (usersRepository.findAll as jest.Mock).mockResolvedValue([users, 2]);

    const result = await service.getUsersByRole(UserRole.DEVELOPER);

    expect(result.length).toBe(1);
    expect(result[0].role).toBe(UserRole.DEVELOPER);
  });
});
