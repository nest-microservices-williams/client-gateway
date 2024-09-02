import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enum/order.enum';

export class StatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
