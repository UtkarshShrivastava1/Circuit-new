// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const Organization = require("../models/Organization.model");
// const User = require("../models/User.model");

// const generateSlug = require("../utils/generateSlug");

// exports.registerCompany = async (req,res) => {

//   console.log(req.headers.authorization);
//   const { companyName, adminName, email, password } = req.body;

//   const slug = generateSlug(companyName);

//   const org = await Organization.create({
//     name: companyName,
//     slug,
//     ownerEmail: email
//   });

//   const hashed = await bcrypt.hash(password,10);

//   const user = await User.create({
//     organizationId: org._id,
//     name: adminName,
//     email,
//     password: hashed,
//     role: "admin"
//   });

//   res.json({
//     message:"Organization created",
//     slug
//   });
// };

// exports.login = async (req,res)=>{

//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if(!user) return res.status(404).json({msg:"User not found"});

//   const valid = await bcrypt.compare(password,user.password);

//   if(!valid) return res.status(401).json({msg:"Invalid password"});

//   const token = jwt.sign({
//       userId:user._id,
//       organizationId:user.organizationId,
//       role:user.role
//   },
//   process.env.JWT_SECRET,
//   { expiresIn:"1d" });

//   res.json({ token });
// };

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

// exports.registerCompany = async (req, res) => {

//   try {

//     const { companyName, adminName, email, password } = req.body;

//     logger.info(`Register company request for: ${companyName}`);

//     const slug = generateSlug(companyName);

//     const existingOrg = await Organization.findOne({ slug });

//     if (existingOrg) {
//       logger.warn(`Organization slug already exists: ${slug}`);
//       return res.status(400).json({
//         message: "Organization already exists"
//       });
//     }

//     const org = await Organization.create({
//       name: companyName,
//       slug,
//       ownerEmail: email
//     });

//     logger.info(`Organization created: ${org._id}`);

//     // Password will be hashed by mongoose middleware
//     const user = await User.create({
//       organization: org._id,
//       name: adminName,
//       email,
//       password,
//       role: "owner"
//     });

//     logger.info(`Admin user created: ${user._id}`);

//     console.log(
//       chalk.green(`✔ New organization registered: ${companyName} (${slug})`)
//     );

//     res.json({
//       message: "Organization created successfully",
//       slug
//     });

//   } catch (error) {

//     logger.error("Register company failed", {
//       error: error.message
//     });

//     res.status(500).json({
//       message: "Server error"
//     });
//   }
// };

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
    console.log(req.body);

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

    const token = jwt.sign(
      {
        userId: user._id,
         name: user.name,
        organization: user.organization,
        role: user.role,
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
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
    
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
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      
      },
      });
      


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