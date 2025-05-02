const express = require('express');
const router = express.Router();
const { getUserAnalytics } = require('../controllers/analytics.controller');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, getUserAnalytics);

module.exports = router;
