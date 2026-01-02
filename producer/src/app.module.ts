import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController], 
  providers: [UserService],
})
export class AppModule {}
