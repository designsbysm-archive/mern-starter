module.exports = (req, res, next) => {
  req.checkAuthRole = requiredRole => {
    const user = req.user;

    // if no user or role stop here
    if (!user || !user.role) {
      return false;
    }

    // if admin or has roles
    return user.role === "admin" || user.role === requiredRole;
  };
  next();
};
