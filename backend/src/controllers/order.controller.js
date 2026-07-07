const Order = require('../models/order.model');
const { sendEmailNotification } = require("../utils/notifier"); 
const mongoose = require('mongoose');

const logger = require('../common/libs/logger');
// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const orderData = { ...req.body, tenantId: tenantId };
    
    // Auto-generate orderNumber if not provided
    if (!orderData.orderNumber) {
       const count = await Order.countDocuments({ tenantId });
       orderData.orderNumber = `SO-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;
    }
    
    // Ensure customerId is a valid ObjectId before creating
    if (orderData.customerId && !mongoose.Types.ObjectId.isValid(orderData.customerId)) {
      // Find customer by a different field if needed, or handle error
      delete orderData.customerId; // For now, we remove it to prevent cast error
    }
    const order = new Order(orderData);
    await order.save();
    
    res.status(201).json({ success: true, data: order, message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create order' });
  }
};

// Get all orders for a tenant
exports.getAllOrders = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const orders = await Order.find({ tenantId }).sort({ createdAt: -1 });
    
    // Map data fields to match what the frontend expects seamlessly
    const mappedOrders = orders.map(order => {
        const orderObj = order.toObject();
        orderObj.id = orderObj._id;
        orderObj.orderValue = orderObj.grandTotal;
        orderObj.orderStatus = orderObj.status;
        orderObj.salesRep = orderObj.salesOwner; 
        orderObj.notes = {
          internal: orderObj.internalNotes || "",
          customer: orderObj.customerNotes || ""
        };
        return orderObj;
    });

    res.status(200).json({ success: true, data: mappedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const order = await Order.findOne({ _id: req.params.id, tenantId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    const orderObj = order.toObject();
    orderObj.id = orderObj._id;
    orderObj.orderValue = orderObj.grandTotal;
    orderObj.orderStatus = orderObj.status;
    orderObj.salesRep = orderObj.salesOwner;
    orderObj.notes = {
      internal: orderObj.internalNotes || "",
      customer: orderObj.customerNotes || ""
    };
    
    res.status(200).json({ success: true, data: orderObj });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const orderId = req.params.id;
    logger.info(`Attempting to update order ID: ${orderId}`, { tenantId, body: req.body });
    
    // Handle frontend alias 'orderStatus' payload
    if (req.body.orderStatus) {
        req.body.status = req.body.orderStatus;
        delete req.body.orderStatus;
        logger.info(`Aliased 'orderStatus' to 'status' for order ID: ${orderId}`);
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!order) {
      logger.warn(`Update failed: Order not found with ID: ${orderId}`, { tenantId });
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    logger.info(`Order updated successfully: ${orderId}`, { tenantId });
    res.status(200).json({ success: true, data: order, message: 'Order updated successfully' });
  } catch (error) {
    logger.error('Error updating order:', { orderId: req.params.id, error: error.message, stack: error.stack });
    res.status(500).json({ success: false, message: error.message || 'Failed to update order' });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const order = await Order.findOneAndDelete({ _id: req.params.id, tenantId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};

// Email the customer with updates
exports.emailCustomer = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const order = await Order.findOne({ _id: req.params.id, tenantId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.email) {
      return res.status(400).json({ success: false, message: 'Customer email not found for this order' });
    }

    const emailHtml = `
      <h3>Order Update: ${order.orderNumber}</h3>
      <p>Dear ${order.contactPerson || order.customerName},</p>
      <p>This is an update regarding your order <b>${order.orderNumber}</b>.</p>
      <p><b>Status:</b> ${order.status}</p>
      <p><b>Order Value:</b> $${order.grandTotal.toLocaleString()}</p>
      <p><b>Expected Delivery:</b> ${order.deliveryDate ? new Date(order.deliveryDate).toDateString() : "N/A"}</p>
      ${order.customerNotes ? `<p><b>Notes:</b> ${order.customerNotes}</p>` : ''}
      <br/><p>Thank you for your business!</p>
    `;

    await sendEmailNotification(order.email, `Update on your Order: ${order.orderNumber}`, emailHtml);
    res.status(200).json({ success: true, message: 'Email sent successfully to ' + order.email });
  } catch (error) {
    console.error('Error sending order email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};