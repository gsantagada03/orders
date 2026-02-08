import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository, UpdateResult } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { OrderStatus } from './enum/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: Repository<Order>;
  let usersRepository: Repository<User>;

  const createUser = (): User => ({
    id: 'u123e456-7890-abcd-ef12-34567890abcd',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    createdAt: new Date('2025-02-05T10:30:00.000Z'),
  });

  const createOrder = (): Order => ({
    id: 'c1a2b3c4-5678-90ab-cdef-1234567890ab',
    user: createUser(),
    productName: 'Wireless Mouse',
    quantity: 2,
    status: OrderStatus.PENDING,
    createdAt: new Date('2026-02-05T10:30:00.000Z'),
    updatedAt: new Date('2026-02-05T10:30:00.000Z'),
    deletedAt: new Date(),
  });

  const createOrderDto = (): CreateOrderDto => ({
    userId: 'u123e456-7890-abcd-ef12-34567890abcd',
    productName: 'iPhone',
    quantity: 1,
  });

  const makeUpdateOrderStatusDto = (): UpdateOrderStatusDto => ({
    status: OrderStatus.CONFIRMED,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  it('should throw NotFoundException if order is not found', async () => {
    jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(null);

    await expect(ordersService.findById('non-existing-id')).rejects.toThrow();
  });

  it('should return an Order object if order is found', async () => {
    const order: Order = createOrder();

    jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(order);

    await expect(
      ordersService.findById('c1a2b3c4-5678-90ab-cdef-1234567890ab'),
    ).resolves.toBe(order);
  });

  it('should return an array of orders', async () => {
    const orders: Order[] = [];
    orders.push(createOrder());

    jest.spyOn(ordersRepository, 'find').mockResolvedValue(orders);

    await expect(
      ordersService.findByUser('u123e456-7890-abcd-ef12-34567890abcd'),
    ).resolves.toBe(orders);

    expect(ordersRepository.find).toHaveBeenCalledWith({
      where: { user: { id: 'u123e456-7890-abcd-ef12-34567890abcd' } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  });

  it('should return an array of orders', async () => {
    const orders: Order[] = [];
    orders.push(createOrder());

    jest.spyOn(ordersRepository, 'find').mockResolvedValue(orders);

    await expect(ordersService.findAll()).resolves.toBe(orders);

    expect(ordersRepository.find).toHaveBeenCalledWith({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  });

  it('should throw NotFoundException if user is not found', async () => {
    const dto: CreateOrderDto = createOrderDto();

    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

    await expect(ordersService.create(dto)).rejects.toThrow();
  });

  it('should return an Order object if order is created', async () => {
    const user: User = createUser();
    const dto: CreateOrderDto = createOrderDto();
    const order: Order = createOrder();

    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(ordersRepository, 'create').mockReturnValue(order);
    jest.spyOn(ordersRepository, 'save').mockResolvedValue(order);

    await expect(ordersService.create(dto)).resolves.toBe(order);
  });

  it('should throw NotFoundException if order is not found', async () => {
    jest.spyOn(ordersRepository, 'findOneBy').mockResolvedValue(null);

    const orderId: string = createOrder().id;
    const updateOrderStatusDto: UpdateOrderStatusDto =
      makeUpdateOrderStatusDto();

    await expect(
      ordersService.updateStatus(orderId, updateOrderStatusDto),
    ).rejects.toThrow();
  });

  it('should throw BadRequestException if order is already completed', async () => {
    const order: Order = createOrder();
    order.status = OrderStatus.COMPLETED;
    const updateOrderStatusDto: UpdateOrderStatusDto =
      makeUpdateOrderStatusDto();

    jest.spyOn(ordersRepository, 'findOneBy').mockResolvedValue(order);
    await expect(
      ordersService.updateStatus(order.id, updateOrderStatusDto),
    ).rejects.toThrow();
  });

  it('should return an Order object if orderStatus is updated', async () => {
    const order: Order = createOrder();
    const updateOrderStatusDto: UpdateOrderStatusDto =
      makeUpdateOrderStatusDto();

    jest.spyOn(ordersRepository, 'findOneBy').mockResolvedValue(order);
    jest.spyOn(ordersRepository, 'save').mockResolvedValue(order);

    await expect(
      ordersService.updateStatus(order.id, updateOrderStatusDto),
    ).resolves.toBe(order);
  });

  it('should throw NotFoundException if order is not found', async () => {
    jest.spyOn(ordersRepository, 'findOneBy').mockResolvedValue(null);

    await expect(ordersService.softDelete('order-id')).rejects.toThrow();
  });

  it('should soft delete the order if found', async () => {
    const order = createOrder();

    jest.spyOn(ordersRepository, 'findOneBy').mockResolvedValue(order);
    jest
      .spyOn(ordersRepository, 'softDelete')
      .mockResolvedValue({ affected: 1 } as UpdateResult);

    await expect(ordersService.softDelete(order.id)).resolves.toBeUndefined();
  });
});
