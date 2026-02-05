import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from 'src/guards/local.guard';
import { User } from 'src/users/entities/user.entity';
import { IUserRequest } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  login(@Req() req: IUserRequest): Promise<{ access_token: string }> {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }
}
