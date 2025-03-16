import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { fullname, email, phoneNumber, password, role } = req.body;

  console.log(req.body);

  try {
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All input fields are required" });
    }

    // handle password length also
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters" });
    }

    // check user is already exis
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    if (!createUser) {
      return res.status(400).json({
        success: false,
        message: "there is an error while creating user.",
      });
    }
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: createUser,
    });
  } catch (error) {
    console.log(`Error in register at line no 52: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All input fields are required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials...." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Account Doesn't Exists with this role..",
      });
    }

    const tokenData = {
      UserId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumner: user.phoneNumner,
      role: user.role,
      profile: user.profile || null,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        user: user,
        message: `Welcome Back ${user.fullname}`,
      });
  } catch (error) {
    console.log(`Error in login at line no 64: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
      })
      .json({ success: true, message: "Logged Out Successfully" });
  } catch (error) {
    console.log(`Error in logout at line no 130: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumner, bio, skills } = req.body;
    const userId = req.id;

    console.log(`User Id: ${userId}`);

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updates = { fullname, email, phoneNumner, bio };
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    if (skills) {
      user.profile.skills = skills.split(",").map((skill) => skill.trim());
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumner: user.phoneNumner,
        role: user.role,
        profile: user.profile || null,
      },
    });
  } catch (error) {
    console.error(`Error in updateProfile: ${error.message}`);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
