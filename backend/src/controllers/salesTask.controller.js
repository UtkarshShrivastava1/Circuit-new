const SalesTask = require('../models/SalesTask.model');
const mongoose = require('mongoose');


exports.createSalesTask = async (req, res) => {
  try {
    const tenantId = req.organization._id;
    const newTask = new SalesTask({
      ...req.body,
      organization: tenantId
    });
    const savedTask = await newTask.save();
    res.status(201).json({ success: true, data: savedTask, message: "Sales task created successfully" });
  } catch (error) {
    console.error("Create Sales Task Error:", error);
    res.status(500).json({ success: false, message: "Failed to create sales task" });
  }
};

exports.getSalesTasks = async (req, res) => {
  try {
    const tenantId = req.organization._id;
    const tasks = await SalesTask.find({ organization: tenantId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error("Get Sales Tasks Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sales tasks" });
  }
};

exports.getSalesTaskById = async (req, res) => {
  try {
    const tenantId = req.organization._id;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid sales task ID format" });
    }
    const task = await SalesTask.findOne({ _id: req.params.id, organization: tenantId });
    if (!task) {
      return res.status(404).json({ success: false, message: "Sales task not found" });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("Get Sales Task By Id Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateSalesTask = async (req, res) => {
  try {
    const tenantId = req.organization._id;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid sales task ID format" });
    }
    const updatedTask = await SalesTask.findOneAndUpdate(
      { _id: req.params.id, organization: tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Sales task not found" });
    }
    res.status(200).json({ success: true, data: updatedTask, message: "Sales task updated successfully" });
  } catch (error) {
    console.error("Update Sales Task Error:", error);
    res.status(500).json({ success: false, message: "Failed to update sales task" });
  }
};

exports.deleteSalesTask = async (req, res) => {
  try {
    const tenantId = req.organization._id;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid sales task ID format" });
    }
    const deletedTask = await SalesTask.findOneAndDelete({ _id: req.params.id, organization: tenantId });
    if (!deletedTask) {
      return res.status(404).json({ success: false, message: "Sales task not found" });
    }
    res.status(200).json({ success: true, message: "Sales task deleted successfully" });
  } catch (error) {
    console.error("Delete Sales Task Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete sales task" });
  }
};