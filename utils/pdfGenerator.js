const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');   // npm install qrcode

exports.boletaPdf = async (boleta) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];
      doc.on('data', c => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(18).text('Boleta de Tránsito', { align: 'center' });
      doc.moveDown().fontSize(12).text(`ID: ${boleta.id}`);
      doc.text(`Placa: ${boleta.placa}`);
      doc.text(`Estado: ${boleta.estado}`);
      doc.text(`Total a pagar: Q${boleta.total_pagar}`);

      // QR con ID
      const qrData = await QRCode.toDataURL(`BOLETA-${boleta.id}`);
      doc.image(qrData, { fit: [80, 80], align: 'right' });

      doc.end();
    } catch (e) { reject(e); }
  });
};
