import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { IUserRequest } from 'src/users/users.controller';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() req: IUserRequest,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.createWish(req.user.id, createWishDto);
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.findOrdered({ createdAt: 'desc' }, 40);
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.findOrdered({ copied: 'desc' }, 10);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishById(@Param('id') wishId: string): Promise<Wish> {
    return await this.wishesService.findOne({ id: +wishId });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishById(
    @Req() req: IUserRequest,
    @Param('id') wishId: string,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.updateWish(
      req.user.id,
      +wishId,
      updateWishDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWishById(
    @Req() req: IUserRequest,
    @Param('id') wishId: string,
  ): Promise<Wish> {
    return await this.wishesService.removeWish(req.user.id, +wishId);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWishById(
    @Req() req: IUserRequest,
    @Param('id') wishId: string,
  ): Promise<Wish> {
    return await this.wishesService.copyWish(req.user.id, +wishId);
  }
}
