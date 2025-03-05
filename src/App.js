import React, { useState, useEffect } from 'react';
import FlightFilter from './components/FlightFilter';
import FlightList from './components/FlightList';
import SeatPreferences from './components/SeatPreferences';
import SeatMap from './components/SeatMap';
import { fetchAllFlights, fetchFilteredFlights, fetchFlightSeats, fetchSeatRecommendations } from './services/api';
import './App.css';

function App() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seats, setSeats] = useState([]);
  const [recommendedSeats, setRecommendedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all flights when component mounts
  useEffect(() => {
    const getFlights = async () => {
      try {
        const data = await fetchAllFlights();
        setFlights(data);
      } catch (error) {
        console.error('Failed to fetch flights');
      }
    };
    getFlights();
  }, []);

  // Handle filter changes
  const handleFilterChange = async (filters) => {
    try {
      const data = await fetchFilteredFlights(filters);
      setFlights(data);
      setSelectedFlight(null);
      setSeats([]);
      setRecommendedSeats([]);
      setSelectedSeats([]);
      setShowFilters(false);
    } catch (error) {
      console.error('Failed to fetch filtered flights');
    }
  };

  // Handle flight selection
  const handleFlightSelect = async (flight) => {
    setSelectedFlight(flight);
    try {
      const data = await fetchFlightSeats(flight.id);
      setSeats(data);
      setRecommendedSeats([]);
      setSelectedSeats([]);
    } catch (error) {
      console.error('Failed to fetch flight seats');
    }
  };

  // Handle seat preferences change
  const handlePreferencesChange = async (preferences) => {
    try {
      const data = await fetchSeatRecommendations(preferences);
      setRecommendedSeats(data);
    } catch (error) {
      console.error('Failed to fetch seat recommendations');
    }
  };

  // Handle seat selection
  const handleSeatClick = (seat) => {
    // Don't allow selecting occupied seats
    if (seat.isOccupied) return;

    // Check if the seat is already selected
    const isSeatSelected = selectedSeats.some(s => s.id === seat.id);

    if (isSeatSelected) {
      // Remove seat from selection
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      // Add seat to selection
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Function to regenerate seats
  const handleRegenerateSeats = async () => {
    if (selectedFlight) {
      try {
        // In a real app, you would call a specific API endpoint to regenerate seats
        // For now, we'll just re-fetch the seats, which will get randomly generated ones from backend
        const data = await fetchFlightSeats(selectedFlight.id);
        setSeats(data);
        setRecommendedSeats([]);
        setSelectedSeats([]);
      } catch (error) {
        console.error('Failed to regenerate seats');
      }
    }
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>Flight Planner</h1>
        </header>

        <div className="container">
          {!selectedFlight ? (
              <div className="flights-container">
                <div className="flight-header">
                  <h2>Available Flights</h2>
                  <button
                      className="toggle-filter-button"
                      onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>

                {showFilters && <FlightFilter onFilterChange={handleFilterChange} />}
                <FlightList flights={flights} onSelectFlight={handleFlightSelect} />
              </div>
          ) : (
              <div className="booking-container">
                <div className="booking-header">
                  <button className="back-button" onClick={() => setSelectedFlight(null)}>
                    &larr; Back to Flights
                  </button>
                  <div className="selected-flight-info">
                    <h2>{selectedFlight.origin} to {selectedFlight.destination}</h2>
                    <div className="flight-details">
                      <span><strong>Flight:</strong> {selectedFlight.flightNumber}</span>
                      <span><strong>Airline:</strong> {selectedFlight.airline}</span>
                      <span><strong>Departure:</strong> {new Date(selectedFlight.departureTime).toLocaleString()}</span>
                      <span><strong>Price:</strong> €{selectedFlight.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-content">
                  <div className="seat-preferences-container">
                    <SeatPreferences
                        flightId={selectedFlight.id}
                        onPreferencesChange={handlePreferencesChange}
                    />

                    {selectedSeats.length > 0 && (
                        <div className="selected-seats-info">
                          <h3>Selected Seats</h3>
                          <div className="selected-seats-list">
                            {selectedSeats.map(seat => (
                                <div key={seat.id} className="selected-seat-item">
                                  {seat.seatNumber}
                                  {seat.isWindow && <span className="seat-tag window-tag">Window</span>}
                                  {seat.hasExtraLegroom && <span className="seat-tag legroom-tag">Extra Legroom</span>}
                                  {seat.isEmergencyExit && <span className="seat-tag exit-tag">Emergency Exit</span>}
                                </div>
                            ))}
                          </div>
                          <button className="book-button">Book Tickets</button>
                        </div>
                    )}
                  </div>

                  <div className="seat-map-container">
                    {seats.length > 0 && (
                        <SeatMap
                            seats={seats}
                            selectedSeats={selectedSeats}
                            recommendedSeats={recommendedSeats}
                            onSeatClick={handleSeatClick}
                            onRegenerateSeats={handleRegenerateSeats}
                        />
                    )}
                  </div>
                </div>
              </div>
          )}
        </div>

        <footer className="App-footer">
          <p>&copy; 2025 Flight Planner. All rights reserved.</p>
        </footer>
      </div>
  );
}

export default App;