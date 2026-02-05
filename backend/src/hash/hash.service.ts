import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  hash(password: string) {
    return bcrypt.hash(
      password,
      this.configService.get<number>('hash.saltRounds'),
    );
  }

  compare(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
