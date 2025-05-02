const jwt = require('jsonwebtoken');

// This middleware will only attach user info or pass error to next middleware
const protect = (requiredRole = null) => {

  console.log("🛡️ Protect middleware initialized...");

  return (req, res, next) => {
    try {
      const rawToken = req.headers['authorization'];
      const token = rawToken?.startsWith('Bearer ') ? rawToken.split(' ')[1] : rawToken;

      if (!token) {
        const error = new Error('No token provided.');
        error.statusCode = 403;
        throw error;
      }

      console.log("🔐 Token received:", token);

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          err.statusCode = 401;
          err.message = 'sai nai token token.';
          return next(err); // Pass error to global error handler
        }
        console.log("✅ Token decoded:", decoded);
        req.user = decoded
        if (requiredRole && req.user.role !== requiredRole) {
          const roleError = new Error(`Access denied. ${requiredRole}s only.`);
          roleError.statusCode = 403;
          return next(roleError);
        }

        console.log("🚀 Auth passed. Moving to next...");
        next(); // Proceed to controller
      });
    } catch (error) {
      console.error("❌ Auth middleware error:", error.message);
      next(error); // Forward to error handling middleware
    }
  };
};

module.exports = { protect };
