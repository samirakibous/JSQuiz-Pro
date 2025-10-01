const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("REQ.USER dans authorizeRoles:", req.user); 
    console.log("Allowed Roles:", allowedRoles);

    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Aucun rôle trouvé" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Accès interdit : rôle '${req.user.role}' non autorisé.`
      });
    }

    next();
  };
};
module.exports = authorizeRoles;
