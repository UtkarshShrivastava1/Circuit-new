const Lead = require('../models/lead.model');

exports.createLead = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const leadData = { ...req.body, tenantId };
    
    const lead = new Lead(leadData);
    await lead.save();
    
    res.status(201).json({ success: true, data: lead, message: 'Lead created successfully' });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create lead' });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const leads = await Lead.find({ tenantId }).sort({ createdAt: -1 });
    
    const mappedLeads = leads.map(lead => {
        const leadObj = lead.toObject();
        leadObj.id = leadObj._id;
        leadObj.createdDate = leadObj.createdAt;
        return leadObj;
    });

    res.status(200).json({ success: true, data: mappedLeads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const lead = await Lead.findOne({ _id: req.params.id, tenantId });
    
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    const leadObj = lead.toObject();
    leadObj.id = leadObj._id;
    leadObj.createdDate = leadObj.createdAt;
    
    res.status(200).json({ success: true, data: leadObj });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lead' });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    const leadObj = lead.toObject();
    leadObj.id = leadObj._id;
    res.status(200).json({ success: true, data: leadObj, message: 'Lead updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update lead' });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, tenantId });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete lead' });
  }
};