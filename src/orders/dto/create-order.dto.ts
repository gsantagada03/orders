import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  public productName: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  public quantity: number;
}
