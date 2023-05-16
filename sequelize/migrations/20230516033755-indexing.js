'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addIndex('users', ['deletedAt'], {
        name: 'users_deletedAt',
        transaction,
      });

      await queryInterface.addIndex('posts', ['userId'], {
        name: 'posts_userId',
        transaction,
      });

      await queryInterface.addIndex('posts', ['title'], {
        name: 'posts_title',
        transaction,
      });

      await queryInterface.addIndex('posts', ['deletedAt'], {
        name: 'posts_deletedAt',
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeIndex('users', 'users_deletedAt', {
        transaction,
      });

      await queryInterface.removeIndex('posts', 'posts_userId', {
        transaction,
      });

      await queryInterface.removeIndex('posts', 'posts_title', {
        transaction,
      });

      await queryInterface.removeIndex('posts', 'posts_deletedAt', {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
