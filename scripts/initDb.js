import db from '../config/db.js';
import AdminUser from '../models/adminUserModel.js';
import Role from '../models/roleModel.js';
import ServiceRequest from '../models/serviceRequestModel.js';
import User from '../models/userModel.js';

const initDb = async () => {
  try {
    await User.createTable();
    await ServiceRequest.createTable();
    await Role.createTable();
    await AdminUser.createTable();
    console.log('Tables created successfully');

    // Seed Super Admin Role
    let superAdminRole = await Role.findByName('Super Admin');
    if (!superAdminRole) {
      superAdminRole = await Role.createRole('Super Admin', ['all'], 'Full access to all features');
      console.log('Super Admin Role created');
    }

    // Seed Super Admin User
    const superAdminEmail = 'robin@gmail.com';
    const existingAdmin = await AdminUser.findByEmail(superAdminEmail);
    if (!existingAdmin) {
      await AdminUser.createAdmin('Robin', superAdminEmail, 'Robin@123', superAdminRole.id);
      console.log('Super Admin User created');
    }

  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    // End the pool to allow the script to exit
    await db.pool.end();
  }
};

initDb();
