const knex = require('knex')(require('../knexfile').development);

exports.getAll = () => knex('roles').select('id', 'name');
