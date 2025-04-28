const Analytics = require('../models/analytics.model');

const getUserAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.findOne({ user: req.user.userId });
    if (!analytics) {
      return res.status(404).json({ message: 'Analytics not found for this user' });
    }
    
    res.json({
      totalFilesUploaded: analytics.totalFilesUploaded,
      totalStorageUsed: analytics.totalStorageUsed,
      totalDownloads: analytics.totalDownloads,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error });
  }
};

module.exports = { getUserAnalytics };
