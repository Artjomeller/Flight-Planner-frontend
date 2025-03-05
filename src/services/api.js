import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Flight related API calls
export const fetchAllFlights = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/flights`);
        return response.data;
    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
};

export const fetchFilteredFlights = async (filters) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/flights/filter`, filters);
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered flights:', error);
        throw error;
    }
};

// Seat related API calls
export const fetchFlightSeats = async (flightId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/seats/flight/${flightId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching flight seats:', error);
        throw error;
    }
};

export const fetchSeatRecommendations = async (preferences) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/seats/recommend`, preferences);
        return response.data;
    } catch (error) {
        console.error('Error fetching seat recommendations:', error);
        throw error;
    }
};