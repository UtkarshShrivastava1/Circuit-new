// const chalk = require("chalk");

const User = require("../models/User.model");

const inviteService = require("../services/invite.service");

const logger = require("../common/libs/logger");

// Safe Chalk Import (Handles ESM/CJS mismatch or missing package)
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
// CREATE EMPLOYEE
// ------------------------------------------------

exports.createEmployee = async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    const organization = req.organization._id;

    logger.info("Create employee request", {
      email,
      organization
    });

    const existing = await User.findOne({
      email,
      organization
    });

    if (existing) {

      logger.warn("Employee already exists", { email });

      return res.status(400).json({
        message: "Employee already exists"
      });

    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "member",
      organization
    });

    logger.info("Employee created", {
      userId: user._id,
      organization
    });

    console.log(
      chalk.green(`✔ Employee created → ${email}`)
    );

    res.status(201).json(user);

  } catch (error) {

    logger.error("Create employee failed", {
      error: error.message
    });

    res.status(500).json({
      message: "Server error"
    });

  }

};



// ------------------------------------------------
// INVITE EMPLOYEE
// ------------------------------------------------

exports.inviteEmployee = async (req, res) => {

  try {

    const { email } = req.body;

    const organizationId = req.organization._id;

    logger.info("Invite employee request", {
      email,
      organizationId
    });

    const token = await inviteService.createInvite(
      email,
      organizationId
    );

    const inviteUrl =
      `${process.env.APP_URL}/invite/${token}`;

    console.log(
      chalk.blue(`📨 Invite created → ${inviteUrl}`)
    );

    res.json({
      message: "Invite generated",
      inviteUrl
    });

  } catch (error) {

    logger.error("Invite employee failed", {
      error: error.message
    });

    res.status(500).json({
      message: "Server error"
    });

  }

};



// ------------------------------------------------
// UPDATE ROLE
// ------------------------------------------------

exports.updateRole = async (req, res) => {

  try {

    const { role } = req.body;

    const { userId } = req.params;

    const organization = req.organization._id;

    logger.info("Update role request", {
      userId,
      role
    });

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        organization
      },
      { role },
      { new: true }
    );

    if (!user) {

      logger.warn("User not found for role update", {
        userId
      });

      return res.status(404).json({
        message: "User not found"
      });

    }

    console.log(
      chalk.yellow(`⚙ Role updated → ${user.email} → ${role}`)
    );

    res.json(user);

  } catch (error) {

    logger.error("Update role failed", {
      error: error.message
    });

    res.status(500).json({
      message: "Server error"
    });

  }

};



// ------------------------------------------------
// DEACTIVATE EMPLOYEE
// ------------------------------------------------

exports.deactivateEmployee = async (req, res) => {

  try {

    const { userId } = req.params;

    const organization = req.organization._id;

    logger.info("Deactivate employee request", {
      userId
    });

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        organization
      },
      { isActive: false },
      { new: true }
    );

    if (!user) {

      logger.warn("User not found for deactivate", {
        userId
      });

      return res.status(404).json({
        message: "User not found"
      });

    }

    console.log(
      chalk.red(`⛔ Employee deactivated → ${user.email}`)
    );

    res.json({
      message: "Employee deactivated"
    });

  } catch (error) {

    logger.error("Deactivate employee failed", {
      error: error.message
    });

    res.status(500).json({
      message: "Server error"
    });

  }

};