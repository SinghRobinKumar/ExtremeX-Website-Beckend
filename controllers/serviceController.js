import Service from '../models/serviceModel.js';

export const createService = async (req, res) => {
  try {
    // Basic validation could be expanded
    const { title, slug } = req.body;
    if (!title || !slug) {
      return res.status(400).json({ message: 'Title and Slug are required' });
    }
    
    // Check if slug exists
    const existing = await Service.findBySlug(slug);
    if (existing) {
        return res.status(400).json({ message: 'Slug already exists' });
    }

    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    console.error('Create Service Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.featured) filters.featured = req.query.featured === 'true';

    const services = await Service.findAll(filters);
    res.json(services);
  } catch (error) {
    console.error('Get All Services Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const service = await Service.findBySlug(slug);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get Service By Slug Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getServiceById = async (req, res) => {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json(service);
    } catch (error) {
      console.error('Get Service By ID Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.update(id, req.body);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Update Service Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.delete(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete Service Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
