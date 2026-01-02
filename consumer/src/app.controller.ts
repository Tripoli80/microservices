import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConsumerService } from './consumer.service';
import { User } from 'type/user.interface';

@Controller()
export class AppController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Get('get-filtered-users')
  async getFilteredUsers(): Promise<User[]> {
    console.log('getFilteredUsers');
    const data = await this.consumerService.getFilteredUsers();
    console.log('data', data);
    return data.users;
  }
}
