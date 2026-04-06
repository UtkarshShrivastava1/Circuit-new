const jwt = require("jsonwebtoken");
// const chalk = require("chalk");

const Organization = require("../models/Organization.model");
const User = require("../models/User.model");
const generateSlug = require("../utils/generateSlug");
const logger = require("../common/libs/logger");
const redis = require("../config/redis");
const config = require("../config");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

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


// ------------------------------------------------------
// REGISTER COMPANY
// ------------------------------------------------------


exports.registerCompany = async (req, res) => {
  try {
    console.log(req.body)
    const { companyName, adminName, email, password } = req.body;

    if (!companyName || !adminName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const slug = generateSlug(companyName);

    // Check slug
    const existingOrg = await Organization.findOne({ slug });
    if (existingOrg) {
      return res.status(400).json({
        message: "Organization already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const organizationId = uuidv4();

    const org = await Organization.create({
      organizationId,
      companyName,
      adminName,
      email,
      password: hashedPassword,
      slug,
      role: "owner",
      subscriptionStatus: "trial",
    });

    await User.create({
      name: adminName,
      email,
      password, // User schema pre-save hook will hash this automatically
      organization: org._id,
      slug,
      role: "owner",
    });

    return res.status(201).json({
      message: "Organization created successfully",
      slug,
      organizationId,
    });
  } catch (error) {
    console.error("Register company error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};



// ------------------------------------------------------
// LOGIN
// ------------------------------------------------------

exports.login = async (req, res) => {

  try {
    console.log("req.body",req.body);

    const { email, password } = req.body;

    logger.info(`Login attempt: ${email}`);
    
 
    // IMPORTANT: select password
    const user = await User
      .findOne({ email 
      })
      .select("+password");

    if (!user) {

      logger.warn(`Login failed: user not found (${email})`);

      return res.status(404).json({
        message: "User not found"
      });

    }


    console.log(user);

    const valid = await user.comparePassword(password);

    if (!valid) {

      logger.warn(`Invalid password for: ${email}`);

      await redis.incr(`login_fail:${email}`);
      await redis.expire(`login_fail:${email}`, 300);

      return res.status(401).json({
        message: "Invalid password"
      });

    }

     

     

    const secret = process.env.JWT_SECRET || config.JWT_SECRET;
   const org = await Organization.findById(user.organization);

    const token = jwt.sign(
      { imageUrl: user.imageUrl || null,
        userId: user._id,
         name: user.name,
        organization: user.organization,
        role: user.role,
        slug: org.slug,
        department: user.department || null,

},
      secret,
      { expiresIn: "1d" }
    );


   
    // Set cookie server-side to prevent "quote" issues from frontend serialization
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    

    // Set user details in a non-httpOnly cookie so the frontend can access it
    res.cookie("user", JSON.stringify({
      token: token,
       imageUrl: user.imageUrl || null,
      userId:user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      slug: org.slug,
      department: user.department || null,
    
    }), {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    
    

    logger.info(`Login success: ${email}`);
    
    console.log(
      chalk.blue(`🔐 User logged in: ${email}`)
    );

    // return res.json({
    //   message: "Login successful",
    //   user: {
    //     name: user.adminName,
    //     email: user.email,
    //     role: user.role,
    //     slug: user.slug,
    //   },
    // });
      return res.json({
        message: "Login successful",
        token,
         user: {
          
        userId:user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        slug: org.slug,
        department: user.department || null,
        imageUrl: user.imageUrl || null,
      
      },
      });
      

    // res.json({
    //   token,
    //   slug: org.slug
    // });

  } catch (error) {

    logger.error("Login failed", {
      error: error.message
    });

    res.status(500).json({
      message: "Server error"
    });

  }

};

exports.logout = (req, res) => {
 
  res.clearCookie("token");
  res.clearCookie("user");

  return res.json({
    message: "Logged out successfully",
  });
};

//auth.controller
exports.getMe =  async (req, res) => {
  try {
    const user = req.user; // attached by middleware
    console.log("Authenticated user in getMe:", user);
    const org = await Organization.findById(user.organization);
    res.json({
      user: {
        userId:user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        department: user.department || null,
         imageUrl: user.imageUrl || null,
         token: req.cookies.token || null,
      },
       slug: org.slug ,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};