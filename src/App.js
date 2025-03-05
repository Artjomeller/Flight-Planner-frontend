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

  return (
      <div className="App">
        <header className="App-header">
          <h1>Flight Planner</h1>
        </header>

        <div className="container">
          <div className="flight-section">
            <FlightFilter onFilterChange={handleFilterChange} />
            <FlightList flights={flights} onSelectFlight={handleFlightSelect} />
          </div>

          {selectedFlight && (
              <div className="seat-section">
                <div className="selected-flight-info">
                  <h2>Selected Flight</h2>
                  <p>
                    <strong>{selectedFlight.flightNumber}</strong>: {selectedFlight.origin} to {selectedFlight.destination}
                  </p>
                  <p>
                    Departure: {new Date(selectedFlight.departureTime).toLocaleString()}
                  </p>
                  <p>
                    Price: €{selectedFlight.price.toFixed(2)}
                  </p>
                </div>

                <SeatPreferences
                    flightId={selectedFlight.id}
                    onPreferencesChange={handlePreferencesChange}
                />

                {seats.length > 0 && (
                    <SeatMap
                        seats={seats}
                        selectedSeats={selectedSeats}
                        recommendedSeats={recommendedSeats}
                        onSeatClick={handleSeatClick}
                    />
                )}

                {selectedSeats.length > 0 && (
                    <div className="selected-seats-info">
                      <h3>Selected Seats</h3>
                      <ul>
                        {selectedSeats.map(seat => (
                            <li key={seat.id}>{seat.seatNumber}</li>
                        ))}
                      </ul>
                      <button className="book-button">Book Tickets</button>
                    </div>
                )}
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