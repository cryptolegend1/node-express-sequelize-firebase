const { Tag } = require('../models');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.send(tag);
  } catch (err) {
    res.send(null);
  }
};

exports.update = (req, res) => {
  res.send(true);
};

exports.delete = async (req, res) => {
  try {
    await Tag.destroy({ where: { id: req.params.id } });
    res.send(true);
  } catch (err) {
    res.send(false);
  }
};

exports.findById = async (req, res) => {
  try {
    const tag = await Tag.findOne({ where: { id: req.params.id } });
    return res.send(tag);
  } catch (err) {
    return res.send(null);
  }
};

exports.findAll = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      order: [['name', 'ASC']]
    });
    return res.send(tags);
  } catch (err) {
    return res.send([]);
  }
};
