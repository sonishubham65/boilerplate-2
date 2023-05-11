import { Module } from '@nestjs/common';
import { cartItemProviders } from './cartItem.model';
import { DatabaseModule } from '../database/database.module';
import { CartItemService } from './cartitem.service';
import { CartItemController } from './cartitem.controller';
import { productProviders } from '../product/product.model';

@Module({
  imports: [DatabaseModule],
  providers: [CartItemService, ...cartItemProviders, ...productProviders],
  controllers: [CartItemController],
})
export class CartItemModule {}
