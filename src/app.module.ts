import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common';
import { CategoriesModule } from './categories/categories.module';
import { envs } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongodbURL),
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
