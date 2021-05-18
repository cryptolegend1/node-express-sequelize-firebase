'use strict';
const { Model } = require('sequelize');
const admin = require('firebase-admin');
const storage = admin.storage();
const bucket = storage.bucket('dev-skael-website.appspot.com');

module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Blog, { foreignKey: 'authorId', as: 'blogs' });
      this.hasMany(models.Comment, { foreignKey: 'authorId' });
    }
  }
  Author.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      avatar: DataTypes.STRING,
      social: DataTypes.JSONB,
      status: DataTypes.INTEGER,
      description: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Author',
      hooks: {
        beforeCreate: (author, options) => {
          author.social = {
            email: '',
            facebook: '',
            linkedin: '',
            twitter: ''
          };
        },
        afterFind: async (results, options) => {
          const authors = Array.isArray(results) ? results : [results];
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + 1);

          const res = await Promise.all(
            authors.map(author => {
              return bucket
                .file(`avatars/${author.avatar}`)
                .getSignedUrl({
                  action: 'read',
                  expires: currentDate.toString()
                });
            })
          );
          
          authors.map((author, index) => {
            author.avatar = res[index][0];
          });
        }
      }
    }
  );
  return Author;
};
