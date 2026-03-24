const Leave = require("../models/Leave.model");
const User = require("../models/User.model");
const logger = require("../common/libs/logger");

// Safe Chalk Import
let chalk;
try {
  chalk = require("chalk");
  if (typeof chalk.red !== "function") throw new Error("Chalk not loaded");
} catch (e) {
  const identity = (str) => str;
  chalk = {
    cyan: identity,
    green: identity,
    yellow: identity,
    red: identity,
    blue: identity,
    white: identity,
    gray: identity,
    bgRed: identity,
  };
}

// ------------------------------------------------
// APPLY FOR LEAVE (Used by User/Employee)
// ------------------------------------------------
exports.applyLeave = async (req, res) => {
  try {
    // Frontend sends: type, fromDate, toDate, reason, attachments, session, emergency
    const {name, type, fromDate, toDate, reason, attachments, session, emergency } = req.body;
    
    // Assuming your auth middleware puts decoded JWT directly into req.user
    const userId = req.user.userId || req.user._id; 
    const organization = req.organization._id;

    logger.info("Apply leave request", { userId, leaveType: type, startDate: fromDate, endDate: toDate });

    const leave = await Leave.create({
      user: userId,
      organization,
      name,
      leaveType: type,
      startDate: fromDate,
      endDate: type === "half-day" ? fromDate : toDate, // Default endDate to fromDate for half-days
      reason,
      attachments,
      session: type === "half-day" ? session : undefined,
      emergency: emergency || false,
      status: "pending",
    });

    console.log(chalk.green(`✔ Leave applied → User:${userId} for ${type}`));
    
    res.status(201).json({
      message: "Leave application submitted successfully",
      leave,
    });
  } catch (error) {
    logger.error("Apply leave failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// GET MY LEAVES (Used by User/Employee)
// ------------------------------------------------
exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const organization = req.organization._id;

    logger.info("Get my leaves request", { userId });

    const leaves = await Leave.find({ user: userId, organization })
      .sort({ createdAt: -1 });

    res.json({
      message: "Leaves retrieved successfully",
      leaves,
      count: leaves.length,
    });
  } catch (error) {
    logger.error("Get my leaves failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// GET ALL LEAVES (Used by Admin/Owner/Manager)
// ------------------------------------------------
exports.getAllLeaves = async (req, res) => {
  try {
    const organization = req.organization._id;
    const { status } = req.query; // allows filtering (e.g., ?status=pending)

    logger.info("Get all leaves request", { organization, status });

    const query = { organization };
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .populate("user", "name email designation department")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "All leaves retrieved successfully",
      leaves,
      count: leaves.length,
    });
  } catch (error) {
    logger.error("Get all leaves failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// GET LEAVE BY ID (Used by Any Role)
// ------------------------------------------------
exports.getLeaveById = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const organization = req.organization._id;

    const leave = await Leave.findOne({ _id: leaveId, organization })
      .populate("user", "name email designation department")
      .populate("approvedBy", "name email");

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json({
      message: "Leave retrieved successfully",
      leave,
    });
  } catch (error) {
    logger.error("Get leave by ID failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// UPDATE LEAVE STATUS (Used by Admin/Owner/Manager)
// ------------------------------------------------
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, managerRemarks } = req.body;
    const approverId = req.user.userId || req.user._id;
    const organization = req.organization._id;

    logger.info("Update leave status request", { leaveId, status, approverId });

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
    }

    const leave = await Leave.findOneAndUpdate(
      { _id: leaveId, organization },
      { 
        status, 
        managerRemarks,
        approvedBy: approverId,
        actionDate: new Date()
      },
      { new: true }
    ).populate("user", "name email");

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    console.log(chalk.yellow(`⚙ Leave ${status} → ${leave.user?.email}`));
    res.json({ message: `Leave ${status} successfully`, leave });
  } catch (error) {
    logger.error("Update leave status failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// BULK UPDATE LEAVE STATUS (Used by Admin/Manager)
// ------------------------------------------------
exports.bulkUpdateLeaveStatus = async (req, res) => {
  try {
    const { leaveIds, status, managerRemarks } = req.body;
    const approverId = req.user.userId || req.user._id;
    const organization = req.organization._id;

    logger.info("Bulk update leave status request", { leaveIds, status, approverId });

    if (!Array.isArray(leaveIds) || leaveIds.length === 0) {
      return res.status(400).json({ message: "leaveIds array is required" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
    }

    const result = await Leave.updateMany(
      { _id: { $in: leaveIds }, organization },
      { 
        status, 
        managerRemarks,
        approvedBy: approverId,
        actionDate: new Date()
      }
    );

    console.log(chalk.yellow(`⚙ Bulk Leave ${status} → ${result.modifiedCount} requests`));
    res.json({ message: `Successfully updated ${result.modifiedCount} leave(s) to ${status}`, modifiedCount: result.modifiedCount });
  } catch (error) {
    logger.error("Bulk update leave status failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// CANCEL LEAVE (Used by User/Employee)
// ------------------------------------------------
exports.cancelLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const userId = req.user.userId || req.user._id;
    const organization = req.organization._id;

    logger.info("Cancel leave request", { leaveId, userId });

    const leave = await Leave.findOne({ _id: leaveId, user: userId, organization });

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({ message: `Cannot cancel a leave that is already ${leave.status}` });
    }

    leave.status = "cancelled";
    await leave.save();

    console.log(chalk.red(`⛔ Leave cancelled → User:${userId}`));
    res.json({ message: "Leave cancelled successfully", leave });
  } catch (error) {
    logger.error("Cancel leave failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// UPDATE LEAVE (Used by User/Employee)
// ------------------------------------------------
exports.updateLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { type, fromDate, toDate, reason, attachments, session, emergency } = req.body;
    const userId = req.user.userId || req.user._id;
    const organization = req.organization._id;

    logger.info("Update leave request", { leaveId, userId });

    const leave = await Leave.findOne({ _id: leaveId, user: userId, organization });

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({ message: `Cannot update a leave that is already ${leave.status}` });
    }

    leave.leaveType = type || leave.leaveType;
    leave.startDate = fromDate || leave.startDate;
    leave.endDate = type === "half-day" ? fromDate : (toDate || leave.endDate);
    leave.reason = reason || leave.reason;
    if (attachments) leave.attachments = attachments;
    if (session) leave.session = session;
    if (emergency !== undefined) leave.emergency = emergency;

    await leave.save();

    console.log(chalk.blue(`✎ Leave updated → User:${userId}`));
    res.json({ message: "Leave updated successfully", leave });
  } catch (error) {
    logger.error("Update leave failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------------------------------
// DELETE LEAVE (Used by User/Employee)
// ------------------------------------------------
exports.deleteLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const userId = req.user.userId || req.user._id;
    const organization = req.organization._id;

    logger.info("Delete leave request", { leaveId, userId });

    const leave = await Leave.findOneAndDelete({ _id: leaveId, user: userId, organization });

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    console.log(chalk.red(`🗑 Leave deleted → User:${userId}`));
    res.json({ message: "Leave deleted successfully", leave });
  } catch (error) {
    logger.error("Delete leave failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};
