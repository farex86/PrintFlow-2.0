// backend/seed/seed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const seedAdmin = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/printflow");

  const hashedPassword = await bcrypt.hash("AdminPass123", 10);

  const admin = new User({
    name: "Admin User",
    email: "admin@printflow.com",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin user created: admin@printflow.com / AdminPass123");

  mongoose.disconnect();
};

seedAdmin();
