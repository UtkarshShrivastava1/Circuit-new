const express = require('express');
const {
  generatePayroll,
  updatePayroll,
  approvePayroll,
  payPayroll,
  getMyPayroll,
  getAllPayroll
} = require('../controllers/payroll.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const tenant = require('../middlewares/tenant.middleware.js');
const { restrictTo } = authMiddleware;

const router = express.Router();

// --- EMPLOYEE ROUTES ---
// Member (Employee) can only view their own payroll
router.get('/:slug/my', authMiddleware, tenant, getMyPayroll);

// --- ADMIN / MANAGER ROUTES ---
// Admins, Owners, and Managers have privileged access to payroll management
router.post('/:slug/generate', authMiddleware, tenant, restrictTo('owner', 'admin', 'manager'), generatePayroll);
router.get('/:slug', authMiddleware, tenant, restrictTo('owner', 'admin', 'manager'), getAllPayroll);
router.put('/:slug/:id', authMiddleware, tenant, restrictTo('owner', 'admin', 'manager'), updatePayroll);
router.put('/:slug/:id/approve', authMiddleware, tenant, restrictTo('owner', 'admin', 'manager'), approvePayroll);
router.put('/:slug/:id/pay', authMiddleware, tenant, restrictTo('owner', 'admin', 'manager'), payPayroll);

module.exports = router;