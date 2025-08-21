// Common soil types found in Sri Lanka
export const SRI_LANKAN_SOIL_TYPES = [
  {
    value: 'red-yellow-podzolic',
    label: 'Red Yellow Podzolic',
    description: 'Well-drained, acidic soils common in hill country'
  },
  {
    value: 'reddish-brown-earth',
    label: 'Reddish Brown Earth',
    description: 'Fertile soils in intermediate zones'
  },
  {
    value: 'low-humic-gley',
    label: 'Low Humic Gley',
    description: 'Poorly drained soils in wet zones'
  },
  {
    value: 'alluvial',
    label: 'Alluvial',
    description: 'River deposited soils, very fertile'
  },
  {
    value: 'regosol',
    label: 'Regosol',
    description: 'Sandy soils along coastal areas'
  },
  {
    value: 'latosol',
    label: 'Latosol',
    description: 'Deep, weathered soils in wet zones'
  },
  {
    value: 'grumusol',
    label: 'Grumusol',
    description: 'Clay-rich soils that swell when wet'
  },
  {
    value: 'solodized-solonetz',
    label: 'Solodized Solonetz',
    description: 'Alkaline soils in dry zones'
  },
  {
    value: 'half-bog',
    label: 'Half Bog',
    description: 'Organic-rich soils in marshy areas'
  },
  {
    value: 'bog',
    label: 'Bog',
    description: 'Peaty soils in wetlands'
  },
  {
    value: 'lithosol',
    label: 'Lithosol',
    description: 'Shallow soils over rock'
  },
  {
    value: 'mountain-regosol',
    label: 'Mountain Regosol',
    description: 'Rocky soils in mountainous areas'
  }
];

// Simplified list for quick selection
export const COMMON_SOIL_TYPES = [
  'Red Yellow Podzolic',
  'Reddish Brown Earth', 
  'Alluvial',
  'Low Humic Gley',
  'Regosol',
  'Latosol',
  'Grumusol',
  'Solodized Solonetz',
  'Half Bog',
  'Bog',
  'Lithosol',
  'Mountain Regosol',
  'Other'
];

export const getSoilTypeDescription = (soilType) => {
  const soil = SRI_LANKAN_SOIL_TYPES.find(s => s.value === soilType || s.label === soilType);
  return soil ? soil.description : '';
};
