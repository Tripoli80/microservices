import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from 'type/user.interface';

interface GetFilteredUsersGrpcService {
  GetFilteredUsers(data: { age: number }): Observable<{ users: User[] }>;
}

@Injectable()
export class ConsumerService implements OnModuleInit {
  private producerService: GetFilteredUsersGrpcService;

  constructor(@Inject('USERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.producerService =
      this.client.getService<GetFilteredUsersGrpcService>('GetFilteredUsers');

    this.getFilteredUsers();
  }

  async getFilteredUsers() {
    const data = await firstValueFrom(
      this.producerService.GetFilteredUsers({
        age: 18,
      }),
    );
    console.log('Producer response Users:', data.users);
    return data;
  }
}
