import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from 'src/config/services';
import { OrderPaginationDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(ORDER_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send({ cmd: 'find_all_orders' }, orderPaginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'find_order' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
