const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  // email: {
  //   type: String,
  //   required: true,
  // },
  ownerEmail: {
    type: String,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'trial', 'suspended'],
    default: 'trial'
  },
  settings: {
    type: Object,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);