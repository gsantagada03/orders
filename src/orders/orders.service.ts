import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from './enum/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // READ
  public async findById(id: string): Promise<Order> {
    const order: Order | null = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  public findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  public findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  // CREATE
  public async create(dto: CreateOrderDto): Promise<Order> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const order: Order = this.ordersRepository.create({
      user,
      productName: dto.productName,
      quantity: dto.quantity,
    });

    return this.ordersRepository.save(order);
  }

  // UPDATE
  public async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order: Order | null = await this.ordersRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException();
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('Order already completed');
    }

    order.status = dto.status;
    return this.ordersRepository.save(order);
  }

  // DELETE (soft)
  public async softDelete(id: string): Promise<void> {
    const order: Order | null = await this.ordersRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException();
    }

    await this.ordersRepository.softDelete(id);
  }
}
