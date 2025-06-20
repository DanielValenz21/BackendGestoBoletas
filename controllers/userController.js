exports.me = (req, res) => {
  // `req.user` fue inyectado por authMiddleware
  res.json(req.user);
};
