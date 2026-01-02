import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";
import { GrpcMethod, Payload } from "@nestjs/microservices";
import { User } from "./type/user.interface";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //gRPC Method
  @GrpcMethod('GetFilteredUsers')
  GetFilteredUsers(@Payload() data: { age: number }): { users: User[] } {
    return { users: this.userService.GetFilteredUsers(data.age) };
  }
}