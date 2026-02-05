import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  async auth(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({ username }, true);
    if (!user) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }

    const isMatched = await this.hashService.compare(password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }

    return user;
  }
}
