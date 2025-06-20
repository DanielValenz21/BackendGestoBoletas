const logService = require('../services/logService');

exports.list = async (req, res, next) => {
  try {
    const data = await logService.list(req.query);
    res.json(data);
  } catch (err) { next(err); }
};
