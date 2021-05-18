const { Blog, Author, Comment, Tag, BlogTag } = require('../models');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const blog = await Blog.create(data);

    await Promise.all(
      data.tags.map(id =>
        BlogTag.create({
          blogId: blog.id,
          tagId: id
        })
      )
    );

    res.send(blog);
  } catch (err) {
    res.send(null);
  }
};

exports.update = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const blog = await Blog.update(data, { where: { id: req.params.id } });

    res.send(blog);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};

exports.delete = async (req, res) => {
  try {
    await Blog.destroy({ where: { id: req.params.id } });
    res.send(true);
  } catch (err) {
    res.send(false);
  }
};

exports.findById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ where: { id: req.params.id } });
    return res.send(blog);
  } catch (err) {
    console.log(err);
    return res.send(null);
  }
};

exports.findAll = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        {
          model: Author,
          as: 'author'
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'description'],
          include: [
            {
              model: Author,
              as: 'author',
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            }
          ]
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      order: [['id', 'ASC']]
    });
    return res.send(blogs);
  } catch (err) {
    return res.send([]);
  }
};

exports.findAllApproved = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        {
          model: Author,
          as: 'author'
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'description'],
          include: [
            {
              model: Author,
              as: 'author',
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            }
          ],
          where: { status: 1 },
          required: false
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      order: [['id', 'ASC']],
      where: { status: 1 }
    });
    return res.send(blogs);
  } catch (err) {
    return res.send([]);
  }
};

exports.countWaiting = async (req, res) => {
  try {
    const count = await Blog.count({ where: { status: 0 } });
    return res.send({ count });
  } catch (err) {
    return res.send(null);
  }
};
