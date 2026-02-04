import { Body, Controller, Get, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET
  @Get()
  public findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  //POST
  @Post()
  public create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }
}