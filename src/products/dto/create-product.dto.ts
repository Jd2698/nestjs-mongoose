import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class Category {
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsObject()
  @ValidateNested()
  @Type(() => Category)
  category: Category;
}
