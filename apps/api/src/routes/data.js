import express from 'express';

const router = express.Router();

// Mock data for styles
const stylesData = [
  { id: '1', name: 'Minimalist', description: 'Clean and simple design', category: 'modern', preview: 'https://example.com/minimalist.png' },
  { id: '2', name: 'Vintage', description: 'Retro-inspired design', category: 'classic', preview: 'https://example.com/vintage.png' },
  { id: '3', name: 'Bold', description: 'Strong and impactful', category: 'modern', preview: 'https://example.com/bold.png' },
  { id: '4', name: 'Elegant', description: 'Sophisticated and refined', category: 'luxury', preview: 'https://example.com/elegant.png' },
  { id: '5', name: 'Playful', description: 'Fun and creative', category: 'modern', preview: 'https://example.com/playful.png' },
  { id: '6', name: 'Industrial', description: 'Raw and edgy', category: 'modern', preview: 'https://example.com/industrial.png' },
  { id: '7', name: 'Pastel', description: 'Soft and gentle colors', category: 'modern', preview: 'https://example.com/pastel.png' },
  { id: '8', name: 'Dark Mode', description: 'Dark theme design', category: 'modern', preview: 'https://example.com/darkmode.png' },
  { id: '9', name: 'Neon', description: 'Bright and vibrant', category: 'modern', preview: 'https://example.com/neon.png' },
  { id: '10', name: 'Monochrome', description: 'Single color variations', category: 'classic', preview: 'https://example.com/monochrome.png' },
  { id: '11', name: 'Gradient', description: 'Smooth color transitions', category: 'modern', preview: 'https://example.com/gradient.png' },
  { id: '12', name: 'Flat', description: 'Flat design style', category: 'modern', preview: 'https://example.com/flat.png' },
  { id: '13', name: 'Glassmorphism', description: 'Frosted glass effect', category: 'modern', preview: 'https://example.com/glass.png' },
  { id: '14', name: 'Neumorphism', description: 'Soft UI design', category: 'modern', preview: 'https://example.com/neumorphism.png' },
  { id: '15', name: 'Cyberpunk', description: 'Futuristic design', category: 'modern', preview: 'https://example.com/cyberpunk.png' },
];

// Mock data for symbols
const symbolsData = [
  { id: '1', name: 'Basic Icons', description: 'Essential UI icons', symbols: ['home', 'search', 'menu', 'user', 'settings'], category: 'ui' },
  { id: '2', name: 'Social Media', description: 'Social platform icons', symbols: ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'], category: 'social' },
  { id: '3', name: 'Weather', description: 'Weather condition symbols', symbols: ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'], category: 'nature' },
  { id: '4', name: 'Commerce', description: 'E-commerce symbols', symbols: ['cart', 'checkout', 'payment', 'delivery', 'return'], category: 'business' },
  { id: '5', name: 'Communication', description: 'Chat and messaging icons', symbols: ['message', 'email', 'phone', 'notification', 'chat'], category: 'communication' },
  { id: '6', name: 'Navigation', description: 'Navigation arrows and controls', symbols: ['up', 'down', 'left', 'right', 'expand'], category: 'ui' },
  { id: '7', name: 'Media', description: 'Audio and video controls', symbols: ['play', 'pause', 'stop', 'volume', 'mute'], category: 'media' },
  { id: '8', name: 'File Types', description: 'Document and file icons', symbols: ['pdf', 'doc', 'image', 'video', 'audio'], category: 'files' },
  { id: '9', name: 'Status', description: 'Status and state indicators', symbols: ['success', 'error', 'warning', 'info', 'loading'], category: 'status' },
  { id: '10', name: 'Travel', description: 'Travel and location symbols', symbols: ['plane', 'car', 'hotel', 'map', 'compass'], category: 'travel' },
];

// Mock data for colors
const colorsData = [
  { id: '1', name: 'Ocean Blue', colors: ['#001f3f', '#0074D9', '#7FDBCA', '#B10DC9', '#FF4136'], category: 'blue' },
  { id: '2', name: 'Sunset', colors: ['#FF6B6B', '#FFA500', '#FFD93D', '#6BCB77', '#4D96FF'], category: 'warm' },
  { id: '3', name: 'Forest', colors: ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D'], category: 'green' },
  { id: '4', name: 'Lavender', colors: ['#E0AAFF', '#D0A2F7', '#C77DFF', '#9D4EDD', '#5A189A'], category: 'purple' },
  { id: '5', name: 'Coral Reef', colors: ['#FF6B9D', '#FFA06B', '#FFD93D', '#6BCB77', '#4D96FF'], category: 'warm' },
  { id: '6', name: 'Monochrome', colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'], category: 'neutral' },
  { id: '7', name: 'Neon Lights', colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'], category: 'vibrant' },
  { id: '8', name: 'Pastel Dream', colors: ['#FFB3BA', '#FFCCCB', '#FFFFBA', '#BAE1FF', '#FFB3D9'], category: 'pastel' },
  { id: '9', name: 'Dark Mode', colors: ['#0D1117', '#161B22', '#21262D', '#30363D', '#484F58'], category: 'dark' },
  { id: '10', name: 'Earthy Tones', colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2B48C'], category: 'warm' },
];

// Helper function to paginate data
function paginateData(data, page, limit, category) {
  let filtered = data;
  
  if (category) {
    filtered = data.filter(item => item.category === category);
  }
  
  const total = filtered.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedData = filtered.slice(start, start + limit);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasMore: page < pages,
    },
  };
}

// GET /data/styles
router.get('/styles', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
  const category = req.query.category || null;
  
  if (page < 1) {
    return res.status(400).json({ error: 'Page must be greater than 0' });
  }
  
  const result = paginateData(stylesData, page, limit, category);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

// GET /data/symbols
router.get('/symbols', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
  const category = req.query.category || null;
  
  if (page < 1) {
    return res.status(400).json({ error: 'Page must be greater than 0' });
  }
  
  const result = paginateData(symbolsData, page, limit, category);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

// GET /data/colors
router.get('/colors', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
  const category = req.query.category || null;
  
  if (page < 1) {
    return res.status(400).json({ error: 'Page must be greater than 0' });
  }
  
  const result = paginateData(colorsData, page, limit, category);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export default router;