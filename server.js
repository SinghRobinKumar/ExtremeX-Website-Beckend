const app = require('./app');
require('dotenv').config();

const User = require('./models/userModel');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await User.createTable();
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
