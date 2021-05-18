const { Author, Blog, Comment } = require('../models');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  try {
    const author = await Author.create(req.body);
    res.send(author);
  } catch (err) {
    res.send(null);
  }
};

exports.update = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const author = await Author.update(data, { where: { id: req.params.id } });

    res.send(author);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};

exports.delete = async (req, res) => {
  try {
    await Author.destroy({ where: { id: req.params.id } });
    res.send(true);
  } catch (err) {
    res.send(false);
  }
};

exports.findById = async (req, res) => {
  try {
    const author = await Author.findOne({
      include: [
        {
          model: Blog,
          as: 'blogs',
          attributes: ['id', 'title', 'description', 'status'],
          include: [
            {
              model: Comment,
              as: 'comments',
              attributes: ['id', 'description', 'status'],
              include: [
                {
                  model: Author,
                  as: 'author',
                  attributes: ['firstName', 'lastName', 'social', 'avatar']
                }
              ]
            }
          ]
        }
      ],
      where: { id: req.params.id }
    });
    return res.send(author);
  } catch (err) {
    console.log(err)
    return res.send(null);
  }
};

exports.findAll = async (req, res) => {
  try {
    const authors = await Author.findAll({
      include: [
        {
          model: Blog,
          as: 'blogs',
          attributes: ['id', 'title']
        }
      ],
      order: [['id', 'ASC']]
    });
    return res.send(authors);
  } catch (err) {
    return res.send([]);
  }
};

exports.findAllApproved = async (req, res) => {
  try {
    const authors = await Author.findAll({
      include: [
        {
          model: Blog,
          as: 'blogs',
          attributes: ['id', 'title']
        }
      ],
      order: [['id', 'ASC']],
      where: { status: 1 }
    });
    return res.send(authors);
  } catch (err) {
    return res.send([]);
  }
};

exports.count = async (req, res) => {
  try {
    const [waiting, approved, rejected] = await Promise.all([
      Author.count({ where: { status: 0 } }),
      Author.count({ where: { status: 1 } }),
      Author.count({ where: { status: 2 } })
    ]);
    return res.send({ waiting, approved, rejected });
  } catch (err) {
    return res.send(null);
  }
};
