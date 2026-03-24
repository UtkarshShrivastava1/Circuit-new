const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const leaveController = require("../controllers/Leave.controller");

// All leave routes require authentication and tenant context
// The :organizationId param is used by the tenant middleware to set req.organization

// User/Employee Routes
router.post(
  "/:organizationId/leaves/apply",
  auth,
  tenant,
  leaveController.applyLeave
);

router.get(
  "/:organizationId/leaves/my",
  auth,
  tenant,
  leaveController.getMyLeaves
);

router.patch(
  "/:organizationId/leaves/:leaveId/cancel",
  auth,
  tenant,
  leaveController.cancelLeave
);

// Admin/Manager Routes
router.get(
  "/:organizationId/leaves/all",
  auth,
  tenant,
  leaveController.getAllLeaves
);

router.patch(
  "/:organizationId/leaves/bulk-status",
  auth,
  tenant,
  leaveController.bulkUpdateLeaveStatus
);

router.get(
  "/:organizationId/leaves/:leaveId",
  auth,
  tenant,
  leaveController.getLeaveById
);

router.patch(
  "/:organizationId/leaves/:leaveId/status",
  auth,
  tenant,
  leaveController.updateLeaveStatus
);
router.put(
  "/:organizationId/leaves/:leaveId",
  auth,
  tenant,
  leaveController.updateLeave
)
router.delete(
  "/:organizationId/leaves/:leaveId",
  auth,
  tenant,
  leaveController.deleteLeave
);

module.exports = router;
