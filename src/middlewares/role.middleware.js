function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Vous devez être connecté." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit : rôle non autorisé." });
    }

    next();
  };
}

module.exports = authorizeRoles;
