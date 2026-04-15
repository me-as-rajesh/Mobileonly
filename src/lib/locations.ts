export interface Location {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export const locations: Location[] = [
  // Major Cities
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },
  { name: 'Delhi', state: 'Delhi', lat: 28.7041, lon: 77.1025 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714 },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lon: 72.8311 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lon: 80.3319 },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577 },
  { name: 'Thane', state: 'Maharashtra', lat: 19.2183, lon: 72.9781 },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185 },
  { name: 'Pimpri-Chinchwad', state: 'Maharashtra', lat: 18.6275, lon: 73.8011 },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lon: 85.1376 },
  { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lon: 73.1812 },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lon: 77.4538 },
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lon: 75.8573 },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lon: 78.0081 },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898 },
  { name: 'Pondicherry', state: 'Puducherry', lat: 11.9416, lon: 79.8083 },
];

export const locationOptions = locations.map(loc => ({
    value: loc.name,
    label: `${loc.name}, ${loc.state}`
}));
