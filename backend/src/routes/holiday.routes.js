const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const holidayController = require("../controllers/Holiday.controller");

// Add a new holiday
router.post(
  "/:organizationId/holidays",
  auth,
  tenant,
  holidayController.addHoliday
);

// Get all holidays for the organization
router.get(
  "/:organizationId/holidays",
  auth,
  tenant,
  holidayController.getHolidays
);

router.put(
  "/:organizationId/holidays/:holidayId",
  auth,
  tenant,
  holidayController.updateHoliday
);

router.delete(
  "/:organizationId/holidays/:holidayId",
  auth,
  tenant,
  holidayController.deleteHoliday
);

module.exports = router;