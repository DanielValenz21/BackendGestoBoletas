const Joi = require('joi');

const createSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  roleId:   Joi.number().integer().min(1).required()
});

const updateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().min(6),
  roleId:   Joi.number().integer().min(1)
}).min(1); // Al menos un campo

const paginationSchema = Joi.object({
  page:  Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

const make = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source]);
  if (error) return res.status(400).json({ message: error.details[0].message });
  req[source] = value; // usa values con defaults
  next();
};

module.exports = {
  validateCreateUser: make(createSchema),
  validateUpdateUser: make(updateSchema),
  validatePagination: make(paginationSchema, 'query')
};
