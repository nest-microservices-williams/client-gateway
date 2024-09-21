import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { ErrorInterceptor } from 'src/common/interceptors/rpc-error.interceptor';
import { NATS_SERVICE } from 'src/config/services';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
@UseInterceptors(ErrorInterceptor)
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto);
  }

  @Get('verify')
  async verifyUser() {
    return this.client.send('auth.verify.user', {});
  }
}
