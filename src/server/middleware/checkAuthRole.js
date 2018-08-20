module.exports = (req, res, next) => {
    req.checkAuthRole = (requiredRole) => {
        const token = req.authToken;

        // allow if open endpoint and any auth is found
        if (requiredRole === '*' && token) {
            return true;
        }

        // if no auth stop here
        if (!token || !token.role) {
            return false;
        }

        // if admin or has roles
        return token.role === 'admin' || token.role === requiredRole;
    };
    next();
};
