
const requireAdmin = async (req, res, next) => {
  try {
    const user = req.user;

    console.log('Admin authorization check:', {
      userId: user?._id,
      userRole: user?.role,
      isAdmin: user?.role === 'admin'
    });

    if (!user) {
      console.log('Admin authorization failed: No user found in request');
      return res.status(401).json({ error: 'Authorization required' });
    }

    if (user.role !== 'admin') {
      console.log(`Admin authorization failed: User ${user._id} has role ${user.role}, not admin`);
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    console.log(`Admin authorization successful for user ${user.name} (${user._id})`);
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAdmin; 