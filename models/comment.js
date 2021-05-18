'use strict';
const { Model } = require('sequelize');
const admin = require('firebase-admin');
const storage = admin.storage();
const bucket = storage.bucket('dev-skael-website.appspot.com');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Author, { foreignKey: 'authorId', as: 'author' });
      this.belongsTo(models.Blog, { foreignKey: 'blogId', as: 'blog' });
    }
  }
  Comment.init(
    {
      blogId: DataTypes.INTEGER,
      authorId: DataTypes.INTEGER,
      description: DataTypes.STRING,
      status: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Comment',
      hooks: {
        afterFind: async (results, options) => {
          const comments = Array.isArray(results) ? results : [results];
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + 1);

          const res = await Promise.all(
            comments.map(comment => {
              return bucket
                .file(`avatars/${comment.author.avatar}`)
                .getSignedUrl({
                  action: 'read',
                  expires: currentDate.toString()
                });
            })
          );
          
          comments.map((comment, index) => {
            comment.author.avatar = res[index][0];
          });
        }
      }
    }
  );
  return Comment;
};
