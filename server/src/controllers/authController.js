import bcrypt from "bcryptjs";
import User from "../models/userModel.js";


import jwt from "jsonwebtoken";
import {
  sendForgotPassword,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../utils/email.js";
import deleteImageFromCloudinary from "../helper/deleteImage.js";
import uploadImageToCloudinary from "../helper/uploadImageToCloudinary.js";


const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const signup = async (req, res) => {
  const { firstname, lastname, username, email, password, phonenumber, role } =
    req.body;

  // Validate required fields
  if (
    !firstname ||
    !lastname ||
    !username ||
    !email ||
    !password ||
    !phonenumber
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All required fields must be filled." });
  }

  try {
    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ email }).select(
      "isVerified"
    );
    if (existingUserByEmail) {
      if (!existingUserByEmail.isVerified) {
        return res.status(400).json({
          success: false,
          message: "User exists but email is not verified.",
        });
      }
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Check if username is already taken
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken. Try a new one.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // Create new user
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      phonenumber,
      role,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    await newUser.save();

    // Send verification email with proper handling
    try {
      const emailResult = await sendVerificationEmail(email, otp);
      if (!emailResult.success) {
        console.error("Failed to send verification email:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    // Respond to client immediately
    res.status(201).json({
      success: true,
      msg: "Signup successful. Please verify your email.",
      data: { userId: newUser._id },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: error.message });
  }
};

//Resend Verification Code Controller
export const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, msg: "Email is required." });
  }

  try {
    const user = await User.findOne({ email }).select(
      "isVerified otp otpExpiry email firstname lastname"
    );
    
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found." });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ success: false, msg: "Account already verified." });
    }

    // Generate a new verification code
    const verificationCode = generateOTP();
    const verificationCodeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5-minute expiry

    user.otp = verificationCode;
    user.otpExpiry = verificationCodeExpires;
    await user.save();

    // Send verification email with proper handling
    try {
      const emailResult = await sendVerificationEmail(email, verificationCode);
      if (!emailResult.success) {
        return res.status(500).json({ 
          success: false, 
          msg: "Failed to send verification email. Please try again later.",
          error: emailResult.error
        });
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json({ 
        success: false, 
        msg: "Error sending verification email",
        error: emailError.message
      });
    }

    res.status(200).json({ 
      success: true, 
      msg: "New verification code sent to your email." 
    });
  } catch (error) {
    console.error("Error sending new code:", error);
    res.status(500).json({ 
      success: false, 
      msg: "Server error", 
      error: error.message 
    });
  }
};

//Verify Account Controller
export const verifyAccount = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ 
      success: false, 
      msg: "Email and verification code are required." 
    });
  }

  try {
    const user = await User.findOne({ email }).select(
      "firstname lastname otp otpExpiry isVerified"
    );
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        msg: "User not found." 
      });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        msg: "Account already verified." 
      });
    }

    if (user.otp !== code) {
      return res.status(400).json({ 
        success: false, 
        msg: "Invalid verification code." 
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ 
        success: false, 
        msg: "Verification code has expired." 
      });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Send welcome email with proper handling
    try {
      const fullName = `${user.firstname} ${user.lastname}`;
      const emailResult = await sendWelcomeEmail(email, fullName);
      
      if (!emailResult.success) {
        console.error("Failed to send welcome email:", emailResult.error);
        // We don't return error here since the account is already verified
      }
    } catch (emailError) {
      console.error("Welcome email error:", emailError);
      // Continue since verification was successful
    }

    res.status(200).json({ 
      success: true, 
      msg: "Account verified successfully." 
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ 
      success: false, 
      msg: "Server error", 
      error: error.message 
    });
  }
};

// Log out
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ msg: "Logout successful." });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      msg: "Email is required." 
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email }).select(
      "email username firstname lastname otp otpExpiry"
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        msg: "User with this email does not exist." 
      });
    }

    // Generate OTP and set expiration time (5 minutes)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    // Update the user's OTP and expiry
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email with proper handling
    try {
      const emailResult = await sendForgotPassword(email, user.username, otp);
      
      if (!emailResult.success) {
        console.error("Failed to send reset password email:", emailResult.error);
        return res.status(500).json({ 
          success: false, 
          msg: "Failed to send reset password email. Please try again later.",
          error: emailResult.error
        });
      }
    } catch (emailError) {
      console.error("Reset password email error:", emailError);
      return res.status(500).json({ 
        success: false, 
        msg: "Error sending reset password email",
        error: emailError.message
      });
    }

    // Respond to the client
    res.status(200).json({ 
      success: true, 
      msg: "Password reset OTP sent to your email." 
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ 
      success: false, 
      msg: "Server error", 
      error: error.message 
    });
  }
};

// OTP Verification Controller
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ msg: "Email and OTP are required." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email }).select(
      "otp otpExpiry isOTPVerified"
    );
    if (!user) {
      return res
        .status(404)
        .json({ msg: "User with this email does not exist." });
    }

    // Check if OTP is correct and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP." });
    }
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ msg: "OTP has expired." });
    }

    // OTP is valid, mark OTP as verified
    user.isOTPVerified = true;
    await user.save();

    // OTP is verified successfully, allow user to reset password
    res.status(200).json({ msg: "OTP verified successfully." });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ msg: "Email and new password are required." });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email }).select("isOTPVerified");
    if (!user) {
      return res
        .status(404)
        .json({ msg: "User with this email does not exist." });
    }

    // Check if OTP is verified
    if (!user.isOTPVerified) {
      return res.status(400).json({ msg: "OTP is not verified." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    user.otp = null; // Clear OTP after successful reset
    user.otpExpiry = null; // Clear OTP expiry
    user.isOTPVerified = false; // Reset OTP verification flag after password reset
    await user.save();

    res.status(200).json({ msg: "Password reset successful." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
};

//Login
export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email }).select(
      "password isVerified status updatedAt role username email"
    );

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Verify account is active and verified
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ msg: "Account is not verified. Please verify your account." });
    }

    if (user.status !== "active") {
      return res
        .status(403)
        .json({ msg: "Account is deactivated. Contact support." });
    }

    // Check if password matches (bcrypt.compare is async, so await it)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Update last login timestamp
    user.updatedAt = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      maxAge: 3600000, 
      sameSite: "strict",
    });

    // Respond with user data and token
    res.status(200).json({
      msg: "Login successful.",
      userId: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
      img: user.profilePic,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getUserDetailsById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId) {
      // Query specific user details excluding the password
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Ensure all nested fields have sensible defaults
      const userData = {
        ...user.toObject(),
        address: {
          homeNo: user.address?.homeNo || "",
          colony: user.address?.colony || "",
          landmark: user.address?.landmark || "",
          pincode: user.address?.pincode || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
        },
        profilePic: user.profilePic || null,
      };

      return res.status(200).json({
        success: true,
        data: userData,
      });
    } else {
      // Get the total number of users
      const totalUsers = await User.countDocuments();

      // Get all users excluding passwords
      const users = await User.find().select("-password");

      return res.status(200).json({
        success: true,
        totalUsers,
        users,
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstname, lastname, phonenumber, address, status } = req.body;

    let parsedAddress = address ? JSON.parse(address) : null;

    let updatedFields = {
      firstname,
      lastname,
      phonenumber,
      status,
    };

    updatedFields = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, value]) => value !== undefined)
    );

    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (parsedAddress) {
      updatedFields.address = {
        ...(user.address ? user.address.toObject() : {}),
        ...parsedAddress,
      };
    }

    if (req.files && req.files.profilePic) {
      const profilePicFile = req.files.profilePic;

      if (user.profilePic) {
        await deleteImageFromCloudinary(user.profilePic);
      }

      const uploadedImageUrl = await uploadImageToCloudinary(profilePicFile);
      updatedFields.profilePic = uploadedImageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    // Check if the new password is different from the current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the current password.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const currentDate = new Date();

    // Start and end of today
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    // Fetch all users from the database
    const users = await User.find();

    // Count total users
    const totalUsers = await User.countDocuments();

    // Count total active users
    const totalActiveUsers = await User.countDocuments({ status: "active" });

    // Count total deactivated users
    const totalDeactivatedUsers = await User.countDocuments({
      status: "deactived",
    });

    // Count today's joined users
    const totalTodayJoinedUsers = await User.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
   const totalNotVerifiedUsers = await User.countDocuments({
    isVerified: false
   })
    // Send a response with the users and statistics
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      stats: {
        totalUsers,
        totalActiveUsers,
        totalDeactivatedUsers,
        totalTodayJoinedUsers,
        totalNotVerifiedUsers
      },
      data: users.map((user) => ({
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        phonenumber: user.phonenumber,
        profilePic: user.profilePic,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    // Handle invalid ObjectId error
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format.",
        error: error.message,
      });
    }

    // General error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

// ////////////////////admin API controllers/////////////////////

// Delete a user by their ID
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findOneAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    res
      .status(200)
      .json({ message: "User and associated data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update the status of a user by their ID
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Validate the status
    if (!["active", "deactived"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the user and update the status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "User status updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
