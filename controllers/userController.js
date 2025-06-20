exports.me = (req, res) => {
  // `req.user` fue inyectado por authMiddleware
  res.json(req.user);
};
const userService = require('../services/userService');

exports.me = (req, res) => res.json(req.user);

exports.create = async (req, res, next) => {
  try {
    const newUser = await userService.create(req.body);
    res.status(201).json(newUser);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const users = await userService.list(req.query.page, req.query.limit);
    res.json(users);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await userService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await userService.remove(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};
