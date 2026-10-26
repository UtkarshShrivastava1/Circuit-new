const SalesNotification = require('../models/SalesNotification.model');
const logger = require('../common/libs/logger')
const User = require("../models/User.model.js");
// exports.getNotifications = async (req, res) => {
//   try {
//     const tenantId = req.tenantId || req.organization?._id;
//     const notifications = await SalesNotification.find({ tenantId }).sort({ createdAt: -1 });
//     res.status(200).json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
//   }
// };
exports.getNotifications = async (req, res) => {
  try {
    const tenantId = req.tenantId || req.organization?._id;
    const userId = req.user?._id;

    if (!tenantId || !userId) {
      return res.status(400).json({
        message: "Tenant or user not found",
      });
    }

    const notifications = await SalesNotification.find({
      tenantId,
      createdById: { $ne: userId },
    }).sort({ createdAt: -1 });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("getNotifications error:", error);

    return res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};
exports.getUnreadNotifications = async (req, res) => {
  try {
    const tenantId = req.tenantId || req.organization?._id;
    const notifications = await SalesNotification.find({ tenantId, isRead: false }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch unread notifications', error: error.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const tenantId = req.tenantId || req.organization?._id;
    const notification = await SalesNotification.findOne({ _id: req.params.id, tenantId });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notification', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const tenantId = req.tenantId || req.organization?._id;
    const notification = await SalesNotification.findOneAndUpdate(
      { _id: req.params.id, tenantId },
      { isRead: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark as read', error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const tenantId = req.tenantId || req.organization?._id;
    await SalesNotification.updateMany({ tenantId, isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark all as read', error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const tenantId = req.tenantId || req.organization?._id;
    await SalesNotification.findOneAndDelete({ _id: req.params.id, tenantId });
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
};

// exports.sendNotification = async (req, res) => {
//   try {
//     logger.info(`Body: ${JSON.stringify(req.body)}`);
//     const tenantId = req.organization?._id  ||  req.tenantId ;
//     const notificationData = { ...req.body, tenantId };

//     logger.info(`tenantID: ${tenantId}`);

    
//     if (req.user) {
//       notificationData.createdBy = req.user.name || req.user.email || 'Admin';
//     }

//     const notification = new SalesNotification(notificationData);
//     await notification.save();
//     res.status(201).json({ message: 'Notification sent successfully', data: notification });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to send notification', error: error.message });
//   }
// };

exports.sendNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      recipientType = "All",
      employee,
      link,
    } = req.body;
  console.log("Request body:", req.body);
    const tenantId = req.organization?._id || req.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        message: "Organization not found",
      });
    }

    // Validate recipient type
    if (!["All", "Employee"].includes(recipientType)) {
      return res.status(400).json({
        message: "Invalid recipient type",
      });
    }

    // Individual employee selection is required
    if (recipientType === "Employee" && !employee) {
      return res.status(400).json({
        message: "Please select an employee",
      });
    }

    // Verify selected employee belongs to this organization
    if (recipientType === "Employee") {
      const selectedEmployee = await User.findOne({
        _id: employee,
        organization: tenantId,
        department: "sales",
      });

      if (!selectedEmployee) {
        return res.status(404).json({
          message: "Sales employee not found",
        });
      }
    }

    const notification = await SalesNotification.create({
      title,
      message,
      type,
      priority,
      recipientType,
      ...(recipientType === "Employee" && { employee }),
      link,
      tenantId,
      createdBy:
        req.user?.name || req.user?.email || "Admin",
      createdById: req.user?._id,
    });
    console.log("Notification created:", notification);
    return res.status(201).json({
      message:
        recipientType === "All"
          ? "Notification created for the Sales Department"
          : "Notification created for the selected employee",
      data: notification,
    });
  } catch (error) {
    logger.error(`sendNotification error: ${error.message}`);

    return res.status(500).json({
      message: "Failed to send notification",
      error: error.message,
    });
  }
};
exports.getNotificationStats = async (req, res) => {
  try {
    const tenantId = req.tenantId || req.organization?._id;
    const total = await SalesNotification.countDocuments({ tenantId });
    const unread = await SalesNotification.countDocuments({ tenantId, isRead: false });
    const readRate = total > 0 ? ((total - unread) / total) * 100 : 0;
    res.status(200).json({ data: { total, unread, readRate: Number(readRate.toFixed(1)), deliveryRate: 99.8 } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};


exports.getSentNotifications = async (req, res) => {
  console.log("getSentNotifications called");
  try {
     
    const tenantId = req.tenantId || req.organization?._id;
    const userId = req.user?._id;
 console.log("User:", req.user);
    console.log("Organization:", req.organization);
    console.log("Tenant ID:", req.tenantId);
    if (!tenantId || !userId) {
      return res.status(400).json({
        message: "Tenant or user not found",
      });
    }

    const notifications = await SalesNotification.find({
      tenantId,
      createdById: userId,
    }).populate('employee', 'name email').sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Sent notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    console.error(`getSentNotifications error: ${error.message}`);
    return res.status(500).json({
      message: "Failed to fetch sent notifications",
      error: error.message,
    });
  }
};