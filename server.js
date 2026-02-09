import dotenv from 'dotenv';
import app from './app.js';
dotenv.config();

import ServiceRequest from './models/serviceRequestModel.js';
import User from './models/userModel.js';
import Service from './models/serviceModel.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await User.createTable();
    await ServiceRequest.createTable();
    await Service.createTable();
    console.log('Tables created successfully (if they needed to be)');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to create tables or start server:', error);
    process.exit(1);
  }
};

startServer();
