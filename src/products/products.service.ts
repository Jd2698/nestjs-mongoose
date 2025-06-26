import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/schemas';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private categoryService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    await this.categoryService.findOne(createProductDto.category.id);

    const createdProduct = new this.productModel({
      name: createProductDto.name,
      price: createProductDto.price,
      category: createProductDto.category.id,
    });

    return await createdProduct.save();
  }

  async findAll(paginationDto: PaginationDto) {
    const totalItems = await this.productModel.countDocuments();

    const limit = paginationDto.limit;
    const page = paginationDto.page - 1;

    const products = await this.productModel
      .find()
      .limit(limit)
      .skip(page * limit);

    return {
      metadata: {
        totalItems: totalItems,
        page: page + 1,
        lastPage: Math.ceil(totalItems / limit),
      },
      data: products,
    };
  }

  async findOne(id: string): Promise<Product> {
    const foundProduct = await this.productModel
      .findById(id)
      .populate('category');

    if (!foundProduct) {
      throw new NotFoundException();
    }

    return foundProduct;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    if (updateProductDto.category?.id) {
      await this.categoryService.findOne(updateProductDto.category.id);
    }

    const { category, ...product } = updateProductDto;

    const updatedProduct = await this.productModel.findByIdAndUpdate(id, {
      ...product,
      category: category?.id,
    });

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return updatedProduct;
  }

  async remove(id: string) {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      throw new NotFoundException();
    }

    return deletedProduct;
  }
}
