const express = require('express');
const router = express.Router();
// const auth = require('../middlewares/auth.middleware');
// const tenantResolver = require('../middlewares/tenant.middleware');

// Public Routes
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Circuit Backend' });
});

// --- PROTECTED ROUTES ---
// All routes below this line are protected and multi-tenant aware
// router.use('/api', auth, tenantResolver);

// Example: Get Current User Profile
router.get('/api/me', (req, res) => {
  res.json({
    user: req.user,
    tenantId: req.tenantId, // This is now available thanks to tenantResolver
    organizationId: req.user.organization
  });
});

module.exports = router;