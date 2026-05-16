import { HttpError } from '../models/http-error.js';

export async function geocodeAddress(address) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ShareUrPlace-Agent/1.0'
      }
    });
    
    if (!response.ok) {
        throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new HttpError('Could not find location for the specified address.', 422);
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (error) {
     if (error instanceof HttpError) {
         throw error;
     }
     throw new HttpError('Something went wrong with finding the location. Please try again.', 500);
  }
}
