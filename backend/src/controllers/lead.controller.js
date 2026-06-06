const LeadModel = require("../models/Lead.model");


const createLead = async (req, res) => {
  const organizationId = req.organization._id;
  try {
    const {
      organization = organizationId,
      leadOwner,
      leadSource,
      customLeadSource,
      industry,
      customIndustry,
      leadStatus,
      priority,
      firstName,
      lastName,
      email,
      gender,
      countryCode,
      customCountryCode,
      phoneNumber,
      companyName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      customCountry,
      description,
    } = req.body;

    // Check required fields
    if (
      !leadOwner ||
      !firstName ||
      !email ||
      !phoneNumber ||
      !companyName
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Duplicate email check
   const existingLead = await LeadModel.findOne({
  organizationId,
  email,
});

    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: "Lead already exists with this email",
      });
    }

    const lead = await LeadModel.create({
        organization,
      leadOwner,
      leadSource,
      customLeadSource,
      industry,
      customIndustry,
      leadStatus,
      priority,
      firstName,
      lastName,
      email,
      gender,
      countryCode,
      customCountryCode,
      phoneNumber,
      companyName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      customCountry,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Create Lead Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const getAllLeads = async (req, res) => {
  const organizationId = req.organization._id;
  try {
    const leads = await LeadModel.find({ organization: organizationId }).populate("leadOwner", "name email");

    return res.status(200).json({
      success: true,
      message: "Leads retrieved successfully",
      data: leads,
    });
  } catch (error) {
    console.error("Get Leads Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



const updateLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const organizationId = req.organization._id;

    const lead = await LeadModel.findOne({
      _id: leadId,
      organizationId,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Email duplicate check (if email is being updated)
    if (req.body.email) {
      const existingLead = await LeadModel.findOne({
        email: req.body.email,
        organizationId,
        _id: { $ne: leadId },
      });

      if (existingLead) {
        return res.status(409).json({
          success: false,
          message: "Lead already exists with this email",
        });
      }
    }

    const updatedLead = await LeadModel.findByIdAndUpdate(
      leadId,
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Update Lead Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const deleteLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const organizationId = req.organization._id;

    const lead = await LeadModel.findOne({
      _id: leadId,
      organizationId,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await LeadModel.findByIdAndDelete(leadId);

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


module.exports = {
  createLead,
  getAllLeads,
  updateLead,
  deleteLead,
};