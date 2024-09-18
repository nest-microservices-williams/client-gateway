import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ErrorInterceptor } from 'src/common/interceptors/rpc-error.interceptor';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { NATS_SERVICE } from 'src/config/services';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto, StatusDto } from './dto';

@Controller('orders')
@UseInterceptors(ErrorInterceptor)
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send({ cmd: 'find_all_orders' }, orderPaginationDto);
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'find_order' }, { id });
  }

  @Get(':status')
  findByStatus(
    @Param() { status }: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.client.send(
      { cmd: 'find_all_orders' },
      { status, ...paginationDto },
    );
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { status }: StatusDto,
  ) {
    return this.client.send({ cmd: 'change_status' }, { id, status });
  }
}
