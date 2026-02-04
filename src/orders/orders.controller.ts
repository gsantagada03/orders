import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // GET
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

  // POST
  @Post()
  public create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(dto);
  }

  // PATCH
  @Patch(':id')
  public updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, dto);
  }

  // DELETE
  @Delete(':id')
  public softDelete(@Param('id') id: string): Promise<void> {
    return this.ordersService.softDelete(id);
  }
}
