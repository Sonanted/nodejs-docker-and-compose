import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { IUserRequest } from 'src/users/users.controller';
import { Wishlist } from './entities/wishlist.entity';
import { JwtGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Post()
  create(
    @Req() req: IUserRequest,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(req.user.id, createWishlistDto);
  }

  @Get(':id')
  findOne(@Param('id') wishlistId: string): Promise<Wishlist> {
    return this.wishlistsService.findOne({ id: +wishlistId });
  }

  @Patch(':id')
  update(
    @Req() req: IUserRequest,
    @Param('id') wishlistId: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(+wishlistId, updateWishlistDto);
  }

  @Delete(':id')
  remove(
    @Req() req: IUserRequest,
    @Param('id') wishlistId: string,
  ): Promise<Wishlist> {
    return this.wishlistsService.remove(+wishlistId);
  }
}
