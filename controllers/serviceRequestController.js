import ServiceRequest from '../models/serviceRequestModel.js';

const createRequest = async (req, res) => {
  try {
    const { serviceName, companyName, projectDetails } = req.body;
    const userId = req.user.id;
    console.log(req.body)

    if (!serviceName || !companyName || !projectDetails) {
      return res.status(400).json({ message: 'Please fix all fields' });
    }

    const request = await ServiceRequest.createRequest({
      userId,
      serviceName,
      companyName,
      projectDetails
    });

    res.status(201).json({ message: 'Service request created successfully', request });
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await ServiceRequest.findByUserId(userId);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { createRequest, getUserRequests };
