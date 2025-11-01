// Sri Lankan districts and their climate zones for cultivation
export const SRI_LANKAN_DISTRICTS = [
 { name: 'Colombo', zone: 'WL1' },
  { name: 'Gampaha', zone: 'WL3' },
  { name: 'Kalutara', zone: 'WL1' },
  { name: 'Kandy', zone: 'WM1' },
  { name: 'Matale', zone: 'IM1' },
  { name: 'Nuwara Eliya', zone: 'WU1' },
  { name: 'Galle', zone: 'WL1' },
  { name: 'Matara', zone: 'WL1' },
  { name: 'Hambantota', zone: 'DL2' },
  { name: 'Jaffna', zone: 'DL2' },
  { name: 'Kilinochchi', zone: 'DL2' },
  { name: 'Mannar', zone: 'DL2' },
  { name: 'Vavuniya', zone: 'DL3' },
  { name: 'Mullaitivu', zone: 'DL2' },
  { name: 'Batticaloa', zone: 'DL1' },
  { name: 'Ampara', zone: 'DL1' },
  { name: 'Trincomalee', zone: 'DL1' },
  { name: 'Kurunegala', zone: 'IM1' },
  { name: 'Puttalam', zone: 'DL1' },
  { name: 'Anuradhapura', zone: 'DL1' },
  { name: 'Polonnaruwa', zone: 'DL1' },
  { name: 'Badulla', zone: 'IM2' },
  { name: 'Moneragala', zone: 'DL3' },
  { name: 'Ratnapura', zone: 'WL2' },
  { name: 'Kegalle', zone: 'WM2' }
];

// Simple array of district names for form dropdowns
export const DISTRICTS = SRI_LANKAN_DISTRICTS.map(d => d.name);

// Zone descriptions for reference
export const CULTIVATION_ZONES = {
  WL1: 'Wet Zone Low Country (WL1)',
  WL2: 'Wet Zone Low Country (WL2)',
  WL3: 'Wet Zone Low Country (WL3)',
  WM1: 'Wet Zone Mid Country (WM1)',
  WM2: 'Wet Zone Mid Country (WM2)',
  WM3: 'Wet Zone Mid Country (WM3)',
  WU1: 'Wet Zone Up Country (WU1)',
  DL1: 'Dry Zone Low Country (DL1)',
  DL2: 'Dry Zone Low Country (DL2)',
  DL3: 'Dry Zone Low Country (DL3)',
  IL1: 'Intermediate Zone Low Country (IL1)',
  IM1: 'Intermediate Zone Mid Country (IM1)',
  IM2: 'Intermediate Zone Mid Country (IM2)'
};

export const getZoneDescription = (zoneCode) => {
  return CULTIVATION_ZONES[zoneCode] || zoneCode;
};

export const getDistrictZone = (districtName) => {
  const district = SRI_LANKAN_DISTRICTS.find(d => d.name === districtName);
  return district ? district.zone : null;
};
