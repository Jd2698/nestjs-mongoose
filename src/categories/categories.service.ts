import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/schemas';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/common';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return await createdCategory.save();
  }

  async findAll(paginationDto: PaginationDto) {
    const limit = paginationDto.limit;
    const page = paginationDto.page - 1;

    const totalItems = await this.categoryModel.countDocuments();
    const categories = await this.categoryModel
      .find()
      .limit(limit)
      .skip(page * limit);

    return {
      metadata: {
        totalItems: totalItems,
        page: page + 1,
        lastPage: Math.ceil(limit / totalItems),
      },
      data: categories,
    };
  }

  async findOne(id: string): Promise<Category> {
    const foundCategory = await this.categoryModel.findById(id);

    if (!foundCategory) {
      throw new NotFoundException('Category not found');
    }

    return foundCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      {
        new: true,
      },
    );

    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }

    return updatedCategory;
  }

  async remove(id: string) {
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      throw new NotFoundException('Category not found');
    }

    return deletedCategory;
  }
}
