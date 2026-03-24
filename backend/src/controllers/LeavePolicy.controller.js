const LeavePolicy = require("../models/LeavePolicy.model");
const logger = require("../common/libs/logger");

exports.getPolicy = async (req, res) => {
  try {
    const organization = req.organization._id;
    
    let policy = await LeavePolicy.findOne({ organization });
    
    // Auto-create default policy if it doesn't exist yet
    if (!policy) {
      policy = await LeavePolicy.create({ organization });
    }
    
    res.json({ policy });
  } catch (error) {
    logger.error("Get leave policy failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const organization = req.organization._id;
    const { casual, sick, paid } = req.body;
    const userId = req.user.userId || req.user._id;

    const policy = await LeavePolicy.findOneAndUpdate(
      { organization },
      { casual, sick, paid, updatedBy: userId },
      { new: true, upsert: true }
    );

    res.json({ message: "Leave policy updated successfully", policy });
  } catch (error) {
    logger.error("Update leave policy failed", { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};