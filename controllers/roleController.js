const roleService = require('../services/roleService');

exports.listRoles = async (_req, res, next) => {
  try {
    const roles = await roleService.getAll();
    res.json(roles);
  } catch (err) { next(err); }
};
