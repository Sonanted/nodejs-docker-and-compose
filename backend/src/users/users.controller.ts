import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Wish } from 'src/wishes/entities/wish.entity';
import { ILike } from 'typeorm';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

export interface IUserRequest {
  user: User;
}

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@Req() req: IUserRequest): Promise<User> {
    return this.usersService.findOne({ id: req.user.id });
  }

  @Patch('me')
  patchCurrentUser(
    @Req() req: IUserRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getCurrentUserWishes(@Req() req: IUserRequest): Promise<Wish[]> {
    return this.usersService.findWishes({ id: req.user.id });
  }

  @Get(':username')
  getUser(@Param('username') username: string): Promise<User> {
    return this.usersService.findOne({ username });
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.findWishes({ username });
  }

  @Post('find')
  findUsers(@Body() findUsersDto: FindUsersDto): Promise<User[]> {
    return this.usersService.findAll([
      { username: ILike(`%${findUsersDto.query}%`) },
      { email: ILike(`%${findUsersDto.query}%`) },
    ]);
  }
}
