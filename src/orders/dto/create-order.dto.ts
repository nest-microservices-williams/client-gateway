import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { OrderStatus } from '../enum/order.enum';

export class CreateOrderDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  totalAmount: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  totalItems: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;

  @IsBoolean()
  @IsOptional()
  paid: boolean = false;
}
