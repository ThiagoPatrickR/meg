'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('payments', 'receipt_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });

    await queryInterface.addColumn('payments', 'invoice_slug', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('payments', 'transaction_id', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('payments', 'receipt_url');
    await queryInterface.removeColumn('payments', 'invoice_slug');
    await queryInterface.removeColumn('payments', 'transaction_id');
  }
};
