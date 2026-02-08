import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const createUserDto = (): CreateUserDto => ({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
  });

  const createUser = (): User => ({
    id: 'u123e456-7890-abcd-ef12-34567890abcd',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    createdAt: new Date('2025-02-05T10:30:00.000Z'),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of users', async () => {
    const users: User[] = [];
    users.push(createUser());

    jest.spyOn(repository, 'find').mockResolvedValue(users);

    await expect(service.findAll()).resolves.toBe(users);
  });

  it('should throw ConflictException if user is found', async () => {
    const user: User = createUser();
    const dto: CreateUserDto = createUserDto();

    jest.spyOn(repository, 'findOne').mockResolvedValue(user);

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('should return an User object if user is created', async () => {
    const dto: CreateUserDto = createUserDto();
    const user: User = createUser();

    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    jest.spyOn(repository, 'create').mockReturnValue(user);
    jest.spyOn(repository, 'save').mockResolvedValue(user);

    await expect(service.create(dto)).resolves.toBe(user);
  });
});
