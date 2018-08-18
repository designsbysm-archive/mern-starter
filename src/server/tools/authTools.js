module.exports = {
    checkAuth: (auth, requiredRole) => {
        // allow if open endpoint and any auth is found
        if (requiredRole === '*' && auth) {
            return true;
        }

        // if no auth stop here
        if (!auth || !auth.role) {
            return false;
        }

        // if admin or has roles
        return auth.role === 'admin' || auth.role === requiredRole;
    },
};
