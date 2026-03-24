const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const taskController = require("../controllers/task.controller");
router.post("/:slug/addTasks/:projectId", auth, tenant, taskController.addTask);
router.put(
  "/:slug/updateTask/:projectId/:taskId",
  auth,
  tenant,
  taskController.updateTask,
);

router.delete(
  "/:slug/deleteTask/:projectId/:taskId",
  auth,
  tenant,
  taskController.deleteTask,
);

router.get(
  "/:slug/getTasks/:projectId",
  auth,
  tenant,
  taskController.getTasks,
);

module.exports = router;
