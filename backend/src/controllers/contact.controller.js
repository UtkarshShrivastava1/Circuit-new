const ContactModel = require("../models/Contact.model");


const createContact = async (req, res) => {
  try {
    const organizationId = req.organization._id;
   console.log("Create Contact Request:", { organizationId, body: req.body });
    const {
      assignedRep,
      firstName,
      lastName,
      gender,
      dob,
      email,
      altEmail,
      phone,
      altPhoneNumber,
      account,
      department,
      designation,
      leadSource,
      status,
      address,
    } = req.body;

    const formattedPhone = {
      countryCode: phone?.countryCode || "+91",
      number: phone?.number,
    };

    const contact = await ContactModel.create({
      organization: organizationId,

      assignedRep,

      firstName,
      lastName,
      gender:
  gender && gender !== "-Select-"
    ? gender
    : undefined,
      dob,

      email,
      altEmail,

      phone: formattedPhone,
      altPhoneNumber,

      company :account,
      department,
      designation,

      leadSource: leadSource && leadSource !== "-Select Source-"
    ? leadSource
    : undefined,
      status,

     address: {
  ...address,
  country:
    address?.country &&
    address.country !== "-Select-"
      ? address.country
      : undefined,
},
    });

    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Create Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating contact",
      error: error.message,
    });
  }
};


const getAllContacts = async (req, res) => {
  try {
    const organizationId = req.organization._id;

    const contacts = await ContactModel.find({
      organization: organizationId,
    })
      .populate("assignedRep", "name email")
     

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const updateContact = async (req, res) => {
  try {
    const organizationId = req.organization._id;
    const { id } = req.params;

    const contact = await ContactModel.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    const updatedContact = await ContactModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteContact = async (req, res) => {
  try {
    const organizationId = req.organization._id;
    const { id } = req.params;

    const deletedContact = await ContactModel.findOneAndDelete({
      _id: id,
      organization: organizationId,
    });

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
      data: deletedContact,
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting contact",
      error: error.message,
    });
  }
};
module.exports = {
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
};
