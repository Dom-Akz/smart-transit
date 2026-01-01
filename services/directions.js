import { Alert } from 'react-native';

/**
 * Search for places using OpenStreetMap (Nominatim)
 * @param {string} query - User input
 * @returns {Promise<Array>} - Array of { label, value: { lat, lon } }
 */
export const searchPlaces = async (query) => {
  if (!query || query.length < 3) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SmartTransitStudentProject/1.0' }
    });
    const result = await response.json();
    
    return result.map(item => ({
      label: item.display_name,
      value: {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }
    }));
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
};

/**
 * Fetch directions using OSRM
 * @param {Object} origin 
 * @param {Object} destination 
 * @param {string} mode 
 */
export const getDirections = async (origin, destination, mode = 'driving') => {
  try {
    // 1. Determine Profile
    let profile = 'driving';
    if (mode === 'walking') profile = 'foot';
    if (mode === 'driving') profile = 'car';
    // For transit, we use driving profile for the map line, 
    // but we will simulate the metadata in the UI
    if (mode === 'transit') profile = 'driving'; 

    // 2. Construct URL
    const start = `${origin.longitude},${origin.latitude}`;
    // destination can be an object {latitude, longitude} or a string (handled previously, but now we expect coords)
    let end = '';
    if (typeof destination === 'string') {
        const places = await searchPlaces(destination);
        if (places.length > 0) {
            end = `${places[0].value.longitude},${places[0].value.latitude}`;
        } else {
            return null;
        }
    } else {
        end = `${destination.longitude},${destination.latitude}`;
    }

    const url = `https://router.project-osrm.org/route/v1/${profile}/${start};${end}?overview=full&geometries=polyline`;
    
    const response = await fetch(url);
    const result = await response.json();

    if (result.code !== 'Ok' || !result.routes || result.routes.length === 0) {
      return null;
    }

    const route = result.routes[0];

    // FIX: Recalculate duration manually if needed or ensure OSRM profile is correct.
    // OSRM returns duration in seconds.
    // Walking speed is approx 1.4 m/s (5 km/h)
    let finalDuration = route.duration;
    if (mode === 'walking') {
         // Force calculation: distance (meters) / 1.4 m/s
         finalDuration = route.distance / 1.3; 
    }

    return {
      coordinates: decodePolyline(route.geometry),
      distance: formatDistance(route.distance),
      duration: formatDuration(finalDuration),
      rawDistance: route.distance,
      rawDuration: finalDuration,
    };
  } catch (error) {
    console.error('Directions Error:', error);
    return null;
  }
};

/**
 * SIMULATED Transit Options
 * Since free global transit APIs are rare, we simulate realistic options
 * based on the driving distance/duration.
 */
export const getTransitOptions = (drivingDurationSeconds, drivingDistanceMeters, origin) => {
  const baseMinutes = Math.round(drivingDurationSeconds / 60);
  
  // Helper to generate a nearby random coordinate (within ~300m)
  const getNearby = (coords) => ({
    latitude: coords.latitude + (Math.random() * 0.003 - 0.0015),
    longitude: coords.longitude + (Math.random() * 0.003 - 0.0015)
  });

  const station1 = origin ? getNearby(origin) : null;
  const station2 = origin ? getNearby(origin) : null;
  const station3 = origin ? getNearby(origin) : null;

  return [
    {
      id: '1',
      type: 'BUS',
      line: '101',
      color: '#4285F4', // Blue
      duration: `${Math.round(baseMinutes * 1.5 + 10)} min`, // Bus is slower + wait time
      departure: 'Now',
      arrival: getTimeFromNow(Math.round(baseMinutes * 1.5 + 10)),
      price: '$2.50',
      stationName: 'Main St & 5th Ave',
      pickupLocation: station1
    },
    {
      id: '2',
      type: 'METRO',
      line: 'A',
      color: '#DB4437', // Red
      duration: `${Math.round(baseMinutes * 0.8 + 5)} min`, // Metro is faster
      departure: 'in 5 min',
      arrival: getTimeFromNow(Math.round(baseMinutes * 0.8 + 10)),
      price: '$3.00',
      stationName: 'Central Station',
      pickupLocation: station2
    },
    {
      id: '3',
      type: 'MIXED',
      line: 'Bus 55 > Walk',
      color: '#0F9D58', // Green
      duration: `${Math.round(baseMinutes * 1.8)} min`,
      departure: 'in 12 min',
      arrival: getTimeFromNow(Math.round(baseMinutes * 1.8 + 12)),
      price: '$2.50',
      stationName: 'Market St Stop',
      pickupLocation: station3
    }
  ];
};

// Helpers
const formatDistance = (meters) => {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

const formatDuration = (seconds) => {
  const mins = Math.round(seconds / 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hours} hr ${rem} min`;
  }
  return `${mins} min`;
};

const getTimeFromNow = (minutesToAdd) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const decodePolyline = (t) => {
  let points = [];
  let index = 0, len = t.length;
  let lat = 0, lng = 0;
  while (index < len) {
    let b, shift = 0, result = 0;
    do { b = t.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1)); lat += dlat;
    shift = 0; result = 0;
    do { b = t.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1)); lng += dlng;
    points.push({ latitude: (lat / 1e5), longitude: (lng / 1e5) });
  }
  return points;
};
