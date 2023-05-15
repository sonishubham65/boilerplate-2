import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from './modules/config/config.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { CartItemModule } from './modules/cart/cartitem.module';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    UserModule,
    AuthModule,
    ProductModule,
    CartItemModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
