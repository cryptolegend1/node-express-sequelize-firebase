'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Blogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      picture: {
        type: Sequelize.STRING
      },
      authorId: {
        type: Sequelize.INTEGER
      },
      views: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0
      },
      likes: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0
      },
      reposts: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0
      },
      readMinutes: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 5
      },
      lastReadAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Blogs');
  }
};
