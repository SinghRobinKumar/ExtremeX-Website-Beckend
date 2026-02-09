import path from 'path';

export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Construct the URL. Assuming server serves 'uploads' statically at root or /uploads
    // We'll serve it at /uploads
    const imageUrl = `/uploads/services/${req.file.filename}`;
    
    // If you need the full URL (e.g. http://localhost:3001/uploads/...), you can prepend it here
    // But usually relative path is more flexible if domain changes.
    // However, for frontend 'next/image' to work with external domains easily,
    // full URL is often easier if we are not proxying. 
    // Let's return the relative path and let the frontend prepend the API URL if needed, 
    // OR return the full URL if we can determine the host.
    // For simplicity and matching the existing pattern, let's return the full URL assuming standard setup.
    // Or better: return the relative path and ensure the backend serves it.
    // The frontend currently expects a URL.
    
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}${imageUrl}`;

    res.json({ 
      message: 'File uploaded successfully', 
      filePath: imageUrl,
      url: fullUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during upload', error: error.message });
  }
};
