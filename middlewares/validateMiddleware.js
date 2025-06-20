const Joi = require('joi');

function makeValidator(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
  };
}

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

module.exports = {
  validateRegister: makeValidator(registerSchema),
  validateLogin:    makeValidator(loginSchema),
  validateRefresh:  makeValidator(refreshSchema)
};
