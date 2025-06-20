/**
 * roleMiddleware(['admin']) → sólo admins
 * roleMiddleware(['admin','supervisor']) → varios roles
 */
module.exports = (allowed) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });

  // req.user.role_id viene de authMiddleware.
  // 1 = admin  | 2 = agente | 3 = cajero | 4 = supervisor  (ajusta si tu tabla roles difiere)
  const roleMap = { 1: 'admin', 2: 'agente', 3: 'cajero', 4: 'supervisor' };
  const roleName = roleMap[req.user.role_id];

  if (!allowed.includes(roleName))
    return res.status(403).json({ message: 'Sin permisos suficientes' });

  next();
};
