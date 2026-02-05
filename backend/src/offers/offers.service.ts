import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto): Promise<Offer> {
    const user = await this.usersService.findOne({ id: userId });
    const wish = await this.wishesService.findOne({
      id: createOfferDto.itemId,
    });
    if (wish.owner.id === user.id) {
      throw new BadRequestException('Нельзя скидываться на свой подарок');
    }
    if (wish.price === wish.raised) {
      throw new BadRequestException('На подарок уже собрана необходимая сумма');
    }
    if (wish.price < wish.raised + createOfferDto.amount) {
      throw new BadRequestException(
        'Сумма заявки превышает оставшуюся стоимость подарка',
      );
    }

    const offer = await this.offersRepository.save({
      ...createOfferDto,
      user: {
        id: userId,
      },
      item: {
        id: wish.id,
      },
    });

    return await this.findOne({ id: offer.id });
  }

  async findAll(): Promise<Offer[]> {
    return await this.offersRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  async findOne(options: FindOptionsWhere<Offer>): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: options,
      relations: {
        user: true,
        item: true,
      },
    });
    if (!offer) {
      throw new NotFoundException('Желающий скинуться не найден');
    }

    return offer;
  }
}
