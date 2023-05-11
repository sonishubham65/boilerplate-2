'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('cartItems', ['userId', 'productId'], {
      unique: true,
      name: 'cart_unique_user_product',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('cartItems', 'cart_unique_user_product');
  },
};
