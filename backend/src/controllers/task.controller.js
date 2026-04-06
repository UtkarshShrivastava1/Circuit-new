const Project = require("../models/Project.model");
const Task = require("../models/Task.model");
const Activity = require('../models/Activity');
// -----------------------------------------------------------
// Add Task
// -----------------------------------------------------------


const addTask = async (req, res) => {
  try {
    const orgId = req.organization._id;
    const userRole = req.user.role;
    const { projectId } = req.params;

    const {
      title,
      description,
      priority,
      attachments,
      status,
      assignedTo,
      dueDate,
      tag,
      subtasks,
    } = req.body;

    // Role check
    if (!["admin", "manager", "owner"].includes(userRole)) {
      return res.status(403).json({
        message: "You are not authorized to add tasks",
      });
    }

    // Project validation
    const project = await Project.findOne({ _id: projectId, orgId });
    if (!project) {
      return res.status(404).json({
        message: "Project not found in this organization",
      });
    }

    // Basic validation
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    // Create task
    const task = new Task({
      organization: orgId,
      projectId,
      title,
      description,
      priority,
      attachments,
      status,
      assignedTo,
      dueDate,
      tag,
      subtasks, // checklist support
    });

    await task.save();

 // 2. Insert the Activity Log here!
    await Activity.create({
      organization: orgId,
      user: req.user.userId || req.user._id, 
      action: "Task Assigned",
      message: `Created a new task: '${task.title}'`,
      referenceId: task._id,
      referenceModel: "Task"
    });
    
    // 3. Emit Realtime Notification
    const io = req.app.get("io");
    if (io) {
      console.log("📡 Emitting 'new_notification' via socket.io for Task Assigned");
      io.emit("new_notification", {
        action: "Task Assigned",
        message: `Created a new task: '${task.title}'`
      });
    }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// -----------------------------------------------------------
// Update Task
// -----------------------------------------------------------
const updateTask = async (req, res) => {
  try {
    const orgId = req.organization._id;
    const userRole = req.user.role;

    const { projectId, taskId } = req.params;

    // Role check
    if (!["admin", "manager", "owner"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update tasks",
      });
    }

    const {
      title,
      description,
      priority,
      attachments,
      status,
      assignedTo,
      dueDate,
      tag,
      subtasks,
    } = req.body;

    const updateFields = {};

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (priority !== undefined) updateFields.priority = priority;
    if (attachments !== undefined) updateFields.attachments = attachments;
    if (status !== undefined) updateFields.status = status;
    if (assignedTo !== undefined) updateFields.assignedTo = assignedTo;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (tag !== undefined) updateFields.tag = tag;
    if (subtasks !== undefined) updateFields.subtasks = subtasks;


    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, projectId, organization: orgId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Update the Activity log to reflect the change
    // By updating `updatedAt`, you can sort your Admin Dashboard by `updatedAt: -1` so this jumps to the top!
    await Activity.findOneAndUpdate(
      { referenceId: taskId, referenceModel: "Task" },
      { 
        action: "Task Updated", 
        message: `Updated task: '${updatedTask.title}'`
      }
    );

    return res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });

  } catch (error) {
    console.error("Update Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//------------------------------------------------------------
// Delete Task
// ------------------------------------------------------------

const deleteTask = async (req, res) => {
  try {
    const orgId = req.organization._id;
    const userRole = req.user.role;

    const { projectId, taskId } = req.params;

    // Role check
    if (!["admin", "manager", "owner"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete tasks",
      });
    }
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      projectId,
      organization: orgId,
    });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Delete the related activity so it disappears from the recent activity feed
    await Activity.deleteMany({ referenceId: taskId, referenceModel: "Task" });

    return res.json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    });

  } catch (error) {
    console.error("Delete Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//-----------------------------
//Get Tasks
//-----------------------------



const getTasks = async (req, res) => {
  try {
    const orgId = req.organization._id;
    const userId = req.user._id;
    const userRole = req.user.role;

    const { projectId } = req.params;
    const { filter } = req.query;

    let query = {
      organization: orgId,
      projectId,
    };

    // Employee  only their tasks
    if (!["admin", "manager", "owner"].includes(userRole)) {
      query.assignedTo = userId;
    }

    const now = new Date();

    // Overdue tasks
    if (filter === "overdue") {
      query.dueDate = { $lt: now };
      query.status = { $ne: "Completed" };
    }

    // High priority tasks
    if (filter === "high") {
      query.priority = "High";
    }

    // This week tasks
    if (filter === "week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay());

      const endOfWeek = new Date();
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      query.dueDate = {
        $gte: startOfWeek,
        $lte: endOfWeek,
      };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });

  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = { addTask, updateTask, deleteTask, getTasks };