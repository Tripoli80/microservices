import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import path from 'path';
import { User } from './type/user.interface';
@Injectable()
export class UserService {
  users: User[] = [];
  constructor() {
    this.users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/user.json'), 'utf8'));
  }
  
  /**
   * Get filtered users
   * @param age - The age of the user
   * @returns The filtered users
   */
  GetFilteredUsers(age: number = 18): User[] {
    console.log('GetFilteredUsers', age);
    if (age < 0){
      throw new BadRequestException('Age must be greater than or equal to 0');
    }
    return this.users.filter(user => user.age >= age);
  }
}
