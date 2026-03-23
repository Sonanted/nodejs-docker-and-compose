import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsArray()
  @IsNotEmpty()
  itemsId: number[];

  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description: string;
}
