import api from './api';

// Get all districts
export const getDistricts = async () => {
  const response = await api.get('/locations/districts');
  return response.data;
};

// Get divisional secretariats for a district
export const getDivisionalSecretariats = async (district) => {
  const response = await api.get(`/locations/divisional-secretariats/${encodeURIComponent(district)}`);
  return response.data;
};

// Get GN divisions for a divisional secretariat
export const getGNDivisions = async (district, divisionalSecretariat) => {
  const response = await api.get(
    `/locations/gn-divisions/${encodeURIComponent(district)}/${encodeURIComponent(divisionalSecretariat)}`
  );
  return response.data;
};

// Get province for a district
export const getProvince = async (district) => {
  const response = await api.get(`/locations/province/${encodeURIComponent(district)}`);
  return response.data;
};

export default {
  getDistricts,
  getDivisionalSecretariats,
  getGNDivisions,
  getProvince,
};
