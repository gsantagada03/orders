import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  public create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(dto);
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findById(id);
  }

  @Get('user/:userId')
  public findByUser(@Param('userId') userId: string): Promise<Order[]> {
    return this.ordersService.findByUser(userId);
  }

  @Get()
  public findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
}
