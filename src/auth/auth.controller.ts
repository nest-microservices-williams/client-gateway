import { Controller, Get, Inject, Post, UseInterceptors } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { ErrorInterceptor } from 'src/common/interceptors/rpc-error.interceptor';
import { NATS_SERVICE } from 'src/config/services';

@Controller('auth')
@UseInterceptors(ErrorInterceptor)
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  async registerUser() {
    return this.client.send('auth.register.user', {});
  }

  @Post('login')
  async loginUser() {
    return this.client.send('auth.login.user', {});
  }

  @Get('verify')
  async verifyUser() {
    return this.client.send('auth.verify.user', {});
  }
}
