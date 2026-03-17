const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const memberController = require("../controllers/member.controller");


router.post("/:slug/members", auth, tenant, memberController.createEmployee);

router.post("/:slug/members/invite", auth, tenant, memberController.inviteEmployee);

router.patch("/:slug/members/:userId/role", auth, tenant, memberController.updateRole);

router.patch("/:slug/members/:userId/deactivate", auth, tenant, memberController.deactivateEmployee);


module.exports = router;