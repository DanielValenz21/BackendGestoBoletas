const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const tokens = await authService.login(req.body);
    res.json(tokens);
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const accessToken = await authService.refresh(req.body.refreshToken);
    res.json({ accessToken });
  } catch (err) { next(err); }
};
