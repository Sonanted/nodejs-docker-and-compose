import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { HashService } from 'src/hash/hash.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hash = await this.hashService.hash(createUserDto.password);
      const user = await this.usersRepository.save({
        ...createUserDto,
        password: hash,
      });

      return await this.findOne({ id: user.id });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        throw new ConflictException(
          'Пользователь с таким email или username существует',
        );
      }
      throw error;
    }
  }

  async findOne(
    options: FindOptionsWhere<User>,
    showPassword = false,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: options,
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        password: showPassword,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const data = updateUserDto.password
      ? {
          ...updateUserDto,
          password: await this.hashService.hash(updateUserDto.password),
        }
      : updateUserDto;
    try {
      const result = await this.usersRepository.update({ id: userId }, data);
      if (result.affected === 0) {
        throw new NotFoundException('Пользователь не найден');
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('Email или username занят');
      }
      throw error;
    }

    return await this.findOne({ id: userId });
  }

  async findWishes(options: FindOptionsWhere<User>): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: options,
      relations: { wishes: true },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.wishes;
  }

  async findAll(options: FindOptionsWhere<User>[]): Promise<User[]> {
    return this.usersRepository.find({ where: options });
  }
}
