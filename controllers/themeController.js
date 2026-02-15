import Theme from '../models/themeModel.js';

// Get all themes (admin only)
export const getThemes = async (req, res, next) => {
  try {
    const themes = await Theme.findAll();
    res.json({ success: true, data: themes });
  } catch (error) {
    next(error);
  }
};

// Get active theme (public endpoint)
export const getActiveTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findActive();
    
    if (!theme) {
      // Return default theme if no active theme found
      return res.json({
        success: true,
        data: {
          name: 'Default',
          colors: {
            primary: '#71DAF2',
            accent: '#FF6B35',
            background: '#000000',
            backgroundLight: '#2E3045',
            textGradientStart: '#FF6B35',
            textGradientEnd: '#71DAF2'
          }
        }
      });
    }
    
    res.json({ success: true, data: theme });
  } catch (error) {
    next(error);
  }
};

// Get theme by ID (admin only)
export const getThemeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const theme = await Theme.findById(id);
    
    if (!theme) {
      return res.status(404).json({ success: false, message: 'Theme not found' });
    }
    
    res.json({ success: true, data: theme });
  } catch (error) {
    next(error);
  }
};

// Create new theme (admin only)
export const createTheme = async (req, res, next) => {
  try {
    const { name, colors, is_template } = req.body;
    
    if (!name || !colors) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and colors are required' 
      });
    }
    
    const theme = await Theme.create({ name, colors, is_template });
    res.status(201).json({ success: true, data: theme });
  } catch (error) {
    next(error);
  }
};

// Update theme (admin only)
export const updateTheme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, colors } = req.body;
    
    const theme = await Theme.update(id, { name, colors });
    
    if (!theme) {
      return res.status(404).json({ success: false, message: 'Theme not found' });
    }
    
    res.json({ success: true, data: theme });
  } catch (error) {
    next(error);
  }
};

// Set theme as active (admin only)
export const setActiveTheme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const theme = await Theme.setActive(id);
    
    if (!theme) {
      return res.status(404).json({ success: false, message: 'Theme not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Theme activated successfully',
      data: theme 
    });
  } catch (error) {
    next(error);
  }
};

// Delete theme (admin only)
export const deleteTheme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const theme = await Theme.delete(id);
    
    if (!theme) {
      return res.status(404).json({ success: false, message: 'Theme not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Theme deleted successfully',
      data: theme 
    });
  } catch (error) {
    next(error);
  }
};
