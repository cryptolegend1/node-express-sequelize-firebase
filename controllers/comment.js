const { Comment, Author, Blog } = require('../models');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const comment = await Comment.create(data);
    res.send(comment);
  } catch (err) {
    res.send(null);
  }
};

exports.update = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const comment = await Comment.update(data, {
      where: { id: req.params.id }
    });

    res.send(comment);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
};

exports.delete = async (req, res) => {
  try {
    await Comment.destroy({ where: { id: req.params.id } });
    res.send(true);
  } catch (err) {
    res.send(false);
  }
};

exports.findById = async (req, res) => {
  try {
    const comment = await Comment.findOne({ where: { id: req.params.id } });
    return res.send(comment);
  } catch (err) {
    return res.send(null);
  }
};

exports.findAll = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: Author,
          as: 'author'
        },
        {
          model: Blog,
          as: 'blog',
          attributes: ['id', 'title'],
          include: [
            {
              model: Author,
              as: 'author',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ],
      order: [['id', 'ASC']]
    });
    return res.send(comments);
  } catch (err) {
    return res.send([]);
  }
};

exports.findAllApproved = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: Author,
          as: 'author'
        },
        {
          model: Blog,
          as: 'blog',
          attributes: ['id', 'title'],
          include: [
            {
              model: Author,
              as: 'author',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ],
      order: [['id', 'ASC']],
      where: { status: 1 }
    });
    return res.send(comments);
  } catch (err) {
    return res.send([]);
  }
};

exports.countWaiting = async (req, res) => {
  try {
    const count = await Comment.count({ where: { status: 0 } });
    return res.send({ count });
  } catch (err) {
    return res.send(null);
  }
};