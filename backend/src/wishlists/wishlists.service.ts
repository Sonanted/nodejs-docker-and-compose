import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    userId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const owner = await this.usersService.findOne({ id: userId });
    const items = await this.wishesService.find({
      id: In(createWishlistDto.itemsId),
    });

    const wishlist = await this.wishlistsRepository.save({
      ...createWishlistDto,
      owner,
      items,
    });

    return this.findOne({ id: wishlist.id });
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async findOne(options: FindOptionsWhere<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: options,
      relations: {
        items: true,
        owner: true,
      },
    });
    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }
    return wishlist;
  }

  async update(
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const result = await this.wishlistsRepository.update(
      { id: wishlistId },
      updateWishlistDto,
    );
    if (result.affected === 0) {
      throw new NotFoundException('Вишлист не найден');
    }
    return await this.findOne({ id: wishlistId });
  }

  async remove(wishlistId: number): Promise<Wishlist> {
    const wishlist = await this.findOne({ id: wishlistId });
    return await this.wishlistsRepository.remove(wishlist);
  }
}
