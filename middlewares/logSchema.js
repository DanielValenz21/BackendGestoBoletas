const Joi = require('joi');

const listSchema = Joi.object({
  userId:      Joi.number().integer().min(1),
  boletaId:    Joi.number().integer().min(1),
  fechaDesde:  Joi.date(),
  fechaHasta:  Joi.date(),
  page:        Joi.number().integer().min(1).default(1),
  limit:       Joi.number().integer().min(1).max(100).default(10)
});

exports.validateLogFilters = (req, _res, next) => {
  const { error, value } = listSchema.validate(req.query);
  if (error) return next(error);
  req.query = value;
  next();
};
