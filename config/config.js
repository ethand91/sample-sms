const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "ethan",
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mernproject'
};

export default config;
