// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    try {
        // Check if user exists (should be set by protect middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Check if user is admin
        if (!req.user.is_admin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Server error during admin check'
        });
    }
};

module.exports = { isAdmin };
