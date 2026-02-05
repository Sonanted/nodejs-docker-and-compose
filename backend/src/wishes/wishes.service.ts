import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async createWish(
    userId: number,
    createWishDto: CreateWishDto,
  ): Promise<Wish> {
    const owner = await this.usersService.findOne({ id: userId });
    const wish = await this.wishesRepository.save({
      ...createWishDto,
      raised: 0,
      owner: owner,
    });

    return await this.findOne({ id: wish.id });
  }

  async findOrdered(
    options: FindOptionsOrder<Wish>,
    limit: number,
  ): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: options,
      relations: { owner: true, offers: true },
      take: limit,
    });
  }

  async find(options: FindOptionsWhere<Wish>): Promise<Wish[]> {
    return await this.wishesRepository.find({ where: options });
  }

  async findOne(options: FindOptionsWhere<Wish>): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: options,
      relations: { owner: true, offers: true },
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return wish;
  }

  async updateWish(
    userId: number,
    wishId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findOne({
      id: wishId,
      owner: {
        id: userId,
      },
    });
    if (wish.offers.length && updateWishDto.price) {
      throw new BadRequestException(
        'Нельзя изменять стоимость подарка, если на него уже скинулись',
      );
    }
    await this.wishesRepository.update({ id: wishId }, updateWishDto);
    return await this.findOne({ id: wishId });
  }

  async removeWish(userId: number, wishId: number): Promise<Wish> {
    const wish = await this.findOne({
      id: wishId,
      owner: {
        id: userId,
      },
    });
    if (wish.offers.length) {
      throw new BadRequestException(
        'Нельзя удалить подарок, если на него уже скинулись',
      );
    }
    return await this.wishesRepository.remove(wish);
  }

  async copyWish(userId: number, wishId: number): Promise<Wish> {
    const wish = await this.findOne({ id: wishId });
    const copiedWish = await this.wishesRepository.save({
      ...wish,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      copied: 0,
      raised: 0,
      offers: [],
      owner: {
        id: userId,
      },
    });

    await this.wishesRepository.update(
      { id: wishId },
      { copied: wish.copied + 1 },
    );

    return copiedWish;
  }
}
