import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard } from '../auth/access.guard';
import { AuthUser } from '../user/user.decorator';
import { CartItemService } from './cartitem.service';

@UseGuards(AccessGuard)
@Controller({
  path: 'cart-item',
  version: '1',
})
export class CartItemController {
  constructor(private cartItemService: CartItemService) {}

  @HttpCode(HttpStatus.CREATED)
  @Get('get')
  async get(@AuthUser() user) {
    return {
      data: {
        cart: await this.cartItemService.getCart(user.id),
      },
    };
  }

  @Post('add')
  async add(@AuthUser() user, @Body() body) {
    await this.cartItemService.addCartItem(user.id, body.productId);
    return {
      message: `Product has been added in cart.`,
    };
  }

  @Post('update')
  async update(@AuthUser() user, @Body() body) {
    // TODO: Authorization is pending
    const product = await this.cartItemService.updateCartItem(
      user.id,
      body.cartItemtId,
      body.quantity,
    );
    return {
      message: 'Cart has been Updated.',
    };
  }

  @Post('delete')
  async delete(@AuthUser() user, @Body() body) {
    // TODO: Authorization is pending
    await this.cartItemService.delete(user.id, body.cartItemtId);
    return {
      message: `Cart item has been removed from cart.`,
    };
  }

  @Post('merge')
  async merge(@AuthUser() user, @Body() body) {
    await this.cartItemService.mergeCart(user.id, body.items);
  }
}
