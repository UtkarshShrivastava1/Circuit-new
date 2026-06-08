const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  leadOwner: { type: String, required: true },
  source: { type: String },
  industry: { type: String },
  status: { type: String, enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"], default: "New" },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  lastContacted: { type: Date },
  value: { type: Number, default: 0 },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);