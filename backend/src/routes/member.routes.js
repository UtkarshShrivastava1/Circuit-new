const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const memberController = require("../controllers/member.controller");


router.post("/:slug/members", auth, tenant, memberController.createEmployee);
router.get("/:slug/members", auth, tenant, memberController.getMembers);
router.get("/:organizationId/members/:userId", auth, tenant, memberController.getEmployeeById);
router.delete("/:organizationId/members/:userId", auth, tenant, memberController.deleteEmployee);
router.patch("/:organizationId/members/:userId", auth, tenant, memberController.updateEmployee);

router.post("/:organizationId/members/invite", auth, tenant, memberController.inviteEmployee);
router.patch("/:organizationId/members/:userId/role", auth, tenant, memberController.updateRole);
router.patch("/:organizationId/members/:userId/deactivate", auth, tenant, memberController.deactivateEmployee);


module.exports = router;