import TeamMember from '../models/teamModel.js';

export const getTeamMembers = async (req, res, next) => {
  try {
    const team = await TeamMember.findAll();
    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

export const getTeamMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);
    
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.update(id, req.body);
    
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.delete(id);
    
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    next(error);
  }
};
