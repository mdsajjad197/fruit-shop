import mongoose from 'mongoose';
import User from '../models/User.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed admin user from .env
    const adminEmail = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      const adminExists = await User.findOne({ email: adminEmail });

      if (!adminExists) {
        await User.create({
          name: 'Super Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
        });
        console.log('🛡️  Default Admin User seeded successfully');
      } else {
        console.log('🛡️  Admin user already exists in database');
      }
    }

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
