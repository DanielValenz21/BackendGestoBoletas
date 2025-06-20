const boletaService = require('../services/boletaService');

exports.create = async (req, res, next) => {
  try {
    // req.user.id es el agente que la crea
    const boleta = await boletaService.create(req.user.id, req.body);
    res.status(201).json(boleta);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const data = await boletaService.list(req.query);
    res.json(data);
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const boleta = await boletaService.detail(req.params.id);
    res.json(boleta);
  } catch (err) { next(err); }
};

exports.registerPago = async (req, res, next) => {
  try {
    const result = await boletaService.registerPago(req.params.id, req.body, req.user.id);
    res.json(result);
  } catch (err) { next(err); }
};

exports.generatePdf = async (req, res, next) => {
  try {
    const pdfBuffer = await boletaService.generatePdf(req.params.id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=boleta.pdf',
      'Content-Length': pdfBuffer.length
    }).send(pdfBuffer);
  } catch (err) { next(err); }
};
