'use strict';
const { Model } = require('sequelize');
const admin = require('firebase-admin');
const storage = admin.storage();
const bucket = storage.bucket('dev-skael-website.appspot.com');

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Author, { foreignKey: 'authorId', as: 'author' });
      this.hasMany(models.Comment, { foreignKey: 'blogId', as: 'comments' });
      this.belongsToMany(models.Tag, {
        through: 'BlogTags',
        as: 'tags',
        foreignKey: 'blogId',
        otherKey: 'tagId'
      });
    }
  }
  Blog.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      picture: DataTypes.STRING,
      authorId: DataTypes.INTEGER,
      views: DataTypes.JSONB,
      likes: DataTypes.JSONB,
      reposts: DataTypes.JSONB,
      readMinutes: DataTypes.INTEGER,
      lastReadAt: DataTypes.DATE,
      status: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Blog',
      hooks: {
        afterFind: async (results, options) => {
          const blogs = Array.isArray(results) ? results : [results];
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + 1);

          const [
            authorAvatars,
            commentAvatars
          ] = await Promise.all([
            Promise.all(
              blogs.map(blog =>
                bucket.file(`avatars/${blog.author.avatar}`).getSignedUrl({
                  action: 'read',
                  expires: currentDate.toString()
                })
              )
            ),
            Promise.all(
              blogs.map(async blog =>
                Promise.all(
                  blog.comments.map(comment =>
                    bucket
                      .file(`avatars/${comment.author.avatar}`)
                      .getSignedUrl({
                        action: 'read',
                        expires: currentDate.toString()
                      })
                  )
                )
              )
            )
          ]);

          authorAvatars.map((avatar, i) => {
            blogs[i].author.avatar = avatar[0];
          });

          commentAvatars.map((avatars, i) => {
            avatars.map((avatar, j) => {
              blogs[i].comments[j].author.avatar = avatar[0];
            });
          });
        }
      }
    }
  );
  return Blog;
};
