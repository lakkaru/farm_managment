// Daily Remarks Categories for Paddy Cultivation
// These categories are specifically designed for Sri Lankan paddy farming operations

export const PADDY_REMARK_CATEGORIES = [
  // General categories
  { value: 'general', label: 'General Observation', icon: '📝', description: 'General observations and notes' },
  { value: 'weather', label: 'Weather Conditions', icon: '🌤️', description: 'Weather observations affecting cultivation' },
  
  // Core paddy cultivation activities
  { value: 'field_preparation', label: 'Field Preparation', icon: '🚜', description: 'Land preparation activities' },
  { value: 'plowing', label: 'Plowing', icon: '🚜', description: 'Plowing and tillage operations' },
  { value: 'seeds_preparation', label: 'Seeds Preparation', icon: '🌾', description: 'Seed selection, treatment, and preparation' },
  { value: 'seeding_sowing', label: 'Seeding/Sowing', icon: '🌱', description: 'Direct seeding or sowing activities' },
  { value: 'transplanting', label: 'Transplanting', icon: '🌿', description: 'Transplanting of paddy seedlings' },
  { value: 'harvesting', label: 'Harvesting', icon: '🎋', description: 'Harvesting operations and yield observations' },
  
  // Crop management
  { value: 'pest', label: 'Pest Activity', icon: '🐛', description: 'Pest sightings and control measures' },
  { value: 'disease', label: 'Disease Symptoms', icon: '🦠', description: 'Disease symptoms and treatments' },
  { value: 'fertilizer', label: 'Fertilizer Application', icon: '🧪', description: 'Fertilizer applications and observations' },
  { value: 'irrigation', label: 'Irrigation & Water', icon: '💧', description: 'Water management and irrigation activities' },
  { value: 'growth', label: 'Plant Growth', icon: '📏', description: 'Growth stages and development observations' },
  
  // Other
  { value: 'other', label: 'Other', icon: '📋', description: 'Other observations not covered above' }
];

// Helper function to get category info
export const getCategoryInfo = (categoryValue) => {
  return PADDY_REMARK_CATEGORIES.find(cat => cat.value === categoryValue) || 
         PADDY_REMARK_CATEGORIES[PADDY_REMARK_CATEGORIES.length - 1]; // Default to 'other'
};

// Get categories grouped by cultivation phase
export const getCategoriesByPhase = () => {
  return {
    'General': ['general', 'weather', 'other'],
    'Field Preparation': ['field_preparation', 'plowing'],
    'Planting': ['seeds_preparation', 'seeding_sowing', 'transplanting'],
    'Crop Management': ['pest', 'disease', 'fertilizer', 'irrigation', 'growth'],
    'Harvesting': ['harvesting']
  };
};

export default PADDY_REMARK_CATEGORIES;
