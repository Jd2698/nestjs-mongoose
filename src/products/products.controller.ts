import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import mongoose from 'mongoose';
import { PaginationDto } from 'src/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    if (!mongoose.Types.ObjectId.isValid(createProductDto.category.id)) {
      throw new BadRequestException('Param Id is not valid');
    }

    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Param Id is not valid');
    }

    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException('Param Id is not valid');

    if (
      updateProductDto.category?.id &&
      !mongoose.Types.ObjectId.isValid(updateProductDto.category?.id)
    )
      throw new BadRequestException('Category Id is not valid');

    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Param Id is not valid');
    }

    return this.productsService.remove(id);
  }
}
