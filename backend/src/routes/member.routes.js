const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const memberController = require("../controllers/member.controller");
const requireRole = require("../middlewares/role.middleware");

router.post("/:slug/members", auth, tenant,  requireRole(["owner", "admin"]), memberController.createEmployee);
router.get("/:slug/members", auth, tenant, memberController.getMembers);
router.get("/:slug/members/sales", auth, tenant, memberController.getSalesEmployees);
router.get("/:slug/members/:userId", auth, tenant, memberController.getEmployeeById);

router.delete("/:slug/members/:userId", auth, tenant, memberController.deleteEmployee);
router.patch("/:slug/members/:userId", auth, tenant, memberController.updateEmployee); 

router.post("/:slug/members/invite", auth, tenant, memberController.inviteEmployee);
router.patch("/:slug/members/:userId/role", auth, tenant, memberController.updateRole);
router.patch("/:slug/members/:userId/deactivate", auth, tenant, memberController.deactivateEmployee);
 

module.exports = router;