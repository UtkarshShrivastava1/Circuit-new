const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const leadController = require("../controllers/lead.controller");

router.post("/:slug/create-lead", auth, tenant, leadController.createLead);
router.get("/:slug/get-all-leads", auth, tenant, leadController.getAllLeads);
router.route("/:slug/get-leads/:id")
  .get(auth, tenant, leadController.getLeadById)
  .put(auth, tenant, leadController.updateLead)
  .delete(auth, tenant, leadController.deleteLead);

module.exports = router;