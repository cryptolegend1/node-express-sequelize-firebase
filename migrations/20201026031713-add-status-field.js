'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Blogs',
        'status',
        {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Comments',
        'status',
        {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'Authors',
        'status',
        {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Authors', 'status', { transaction });
      await queryInterface.removeColumn('Blogs', 'status', { transaction });
      await queryInterface.removeColumn('Comments', 'status', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
