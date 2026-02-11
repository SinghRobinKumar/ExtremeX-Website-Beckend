import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/adminUserModel.js';
import Role from '../models/roleModel.js';
import ServiceRequest from '../models/serviceRequestModel.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminUser.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Access token - short lived (e.g. 15m or 1h)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Refresh token - long lived (e.g. 7 days)
    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh Token is required' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await AdminUser.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role_name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token: newToken });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ message: 'Invalid Refresh Token' });
    }
};

const getUsers = async (req, res) => {
  try {
    const users = await AdminUser.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    const existing = await AdminUser.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const newUser = await AdminUser.createAdmin(name, email, password, roleId);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, permissions, description } = req.body;
    const newRole = await Role.createRole(name, permissions, description);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.findAll();
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress } = req.body;
    const updatedRequest = await ServiceRequest.update(id, { status, progress });
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, roleId } = req.body;
    
    // Check if user exists (excluding current user checks can be complex, skipping for simplicity/MVP)
    const existing = await AdminUser.findByEmail(email);
    if (existing && existing.id !== parseInt(id)) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    const updatedUser = await AdminUser.update(id, { name, email, password, roleId });
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await AdminUser.delete(id);
    if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { createRole, createUser, deleteUser, getAllRequests, getRoles, getUsers, login, refreshToken, updateRequest, updateUser };

