/**
 * Format area values for display
 * Handles both nested {value, unit} structure and flat number values
 */
export const formatArea = (area) => {
  if (!area) return 'N/A';
  
  // Handle both old nested structure {value, unit} and new flat number
  if (typeof area === 'object' && area.value !== undefined) {
    return `${area.value.toLocaleString()} ${area.unit || 'acres'}`;
  }
  
  // Handle flat number structure
  if (typeof area === 'number') {
    return `${area.toLocaleString()} acres`;
  }
  
  return 'N/A';
};

/**
 * Extract area value for form inputs
 * Returns the numeric value regardless of structure
 */
export const getAreaValue = (area) => {
  if (!area) return '';
  
  // Handle nested structure
  if (typeof area === 'object' && area.value !== undefined) {
    return area.value;
  }
  
  // Handle flat number
  if (typeof area === 'number') {
    return area;
  }
  
  return '';
};

/**
 * Format farm type for display
 */
export const getFarmTypeColor = (type) => {
  const colors = {
    crop: 'success',
    livestock: 'warning', 
    mixed: 'info',
    aquaculture: 'primary',
    poultry: 'secondary',
  };
  return colors[type] || 'default';
};
