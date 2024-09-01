import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from 'src/config/services';

@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCT_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createProduct() {
    return 'This action adds a new product';
  }

  @Get()
  getAllProducts() {
    return this.client.send({ cmd: 'find_all_products' }, {});
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return 'This action returns a product';
  }

  @Patch(':id')
  updateProduct(@Param('id') id: string) {
    return 'This action updates a product';
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return 'This action removes a product';
  }
}
