import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  public productName: string;

  @IsNumber()
  @IsNotEmpty()
  public quantity: number;
}
