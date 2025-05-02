// authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyAdminToken = async (req, res, next) => {
    // Get token from header - more reliable method
    const authHeader = req.headers['authorization']; // lowercase 'authorization'
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(403).json({ message: 'Authorization denied' });
    }
  
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user is admin
      const admin = await Admin.findById(decoded.id);
      
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: 'Admin privileges required' });
      }
      
      // Attach user to request
      req.user = admin; // Attach the full admin document, not just decoded token
      next();
    } catch (err) {
      console.error('Token verification error:', err.message);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token expired' });
      }
      
      res.status(403).json({ message: 'Invalid token' });
    }
  };

module.exports = verifyAdminToken;