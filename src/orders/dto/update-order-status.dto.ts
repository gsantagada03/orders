import { IsEnum, IsNotEmpty } from 'class-validator';

import { OrderStatus } from '../enum/order-status.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  public status: OrderStatus;
}