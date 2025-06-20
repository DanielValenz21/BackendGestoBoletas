const Joi = require('joi');

// Artículo individual
const articuloSchema = Joi.object({
  articulo_codigo: Joi.string().max(50).required(),
  monto:           Joi.number().positive().required()
});

exports.validateCreateBoleta = (req, res, next) => {
  const schema = Joi.object({
    placa:               Joi.string().max(20).required(),
    tarjeta_circulacion: Joi.string().max(20).allow(null, ''),
    nit:                 Joi.string().max(20).allow(null, ''),
    tipo_vehiculo:       Joi.string().max(50).allow(null, ''),
    marca:               Joi.string().max(100).allow(null, ''),
    color:               Joi.string().max(100).allow(null, ''),
    conductor_ausente:   Joi.boolean().default(false),
    genero:              Joi.string().valid('M','F','O').default('O'),
    documento:           Joi.string().max(50).allow(null, ''),
    licencia_tipo:       Joi.string().allow(null, ''),
    licencia_numero:     Joi.string().allow(null, ''),
    direccion:           Joi.string().allow(null, ''),
    lugar:               Joi.string().allow(null, ''),
    fecha_infraccion:    Joi.date().required(),
    hora_infraccion:     Joi.string().required(),   // HH:mm:ss
    base_legal:          Joi.string().allow(null, ''),
    observaciones:       Joi.string().allow(null, ''),
    descuento_pct:       Joi.number().min(0).max(100).default(0),
    total_pagar:         Joi.number().positive().required(),
    articulos:           Joi.array().items(articuloSchema).min(1).max(3).required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  req.body = value; next();
};

exports.validateListBoletas = (req, _res, next) => {
  const schema = Joi.object({
    estado:      Joi.string().valid('Pendiente','Pagada','Exonerada'),
    placa:       Joi.string(),
    agenteId:    Joi.number().integer().min(1),
    fechaDesde:  Joi.date(),
    fechaHasta:  Joi.date(),
    page:        Joi.number().integer().min(1).default(1),
    limit:       Joi.number().integer().min(1).max(100).default(10)
  });
  const { error, value } = schema.validate(req.query);
  if (error) return next(error);
  req.query = value; next();
};

exports.validatePago = (req, res, next) => {
  const schema = Joi.object({
    fechaPago: Joi.date().required(),
    recibo:    Joi.string().max(100).required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  req.body = value; next();
};
