import React, { useState, useEffect } from 'react';
import FlightFilter from './components/FlightFilter';
import FlightList from './components/FlightList';
import SeatPreferences from './components/SeatPreferences';
import SeatMap from './components/SeatMap';
import { fetchAllFlights, fetchFilteredFlights, fetchFlightSeats} from './services/api';
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

  // Function to randomly mark seats as occupied
  const generateRandomlyOccupiedSeats = (seats) => {
    return seats.map(seat => ({
      ...seat,
      isOccupied: Math.random() < 0.3 // ~30% of seats will be occupied
    }));
  };

  // Handle flight selection
  const handleFlightSelect = async (flight) => {
    setSelectedFlight(flight);
    try {
      const data = await fetchFlightSeats(flight.id);

      // Generate randomly occupied seats
      const randomlyOccupiedSeats = generateRandomlyOccupiedSeats(data);

      setSeats(randomlyOccupiedSeats);
      setRecommendedSeats([]);
      setSelectedSeats([]);
    } catch (error) {
      console.error('Failed to fetch flight seats');
    }
  };

  // Handle seat preferences change
  const handlePreferencesChange = (preferences) => {
    // Filter available seats (not occupied)
    const availableSeats = seats.filter(seat => !seat.isOccupied);

    console.log("Available seats:", availableSeats.length); // Debugging

    // Rakenda filtrid eelistuste järgi
    let filteredSeats = [...availableSeats];

    // Rakenda aknakoha eelistust, kui see on valitud
    if (preferences.preferWindow) {
      filteredSeats = filteredSeats.filter(seat => seat.isWindow);
      console.log("After window filter:", filteredSeats.length); // Debugging
    }

    // Rakenda lisajalaruumi eelistust, kui see on valitud
    if (preferences.preferExtraLegroom) {
      filteredSeats = filteredSeats.filter(seat => seat.hasExtraLegroom);
      console.log("After legroom filter:", filteredSeats.length); // Debugging
    }

    // Rakenda väljapääsu läheduse eelistust, kui see on valitud
    if (preferences.preferEmergencyExit) {
      filteredSeats = filteredSeats.filter(seat => seat.isEmergencyExit);
      console.log("After emergency exit filter:", filteredSeats.length); // Debugging
    }

    // Kui pärast filtreerimist pole istekohti alles jäänud, kasuta kõiki vabasid istekohti
    if (filteredSeats.length === 0) {
      console.log("No seats match all criteria, using all available seats");
      filteredSeats = [...availableSeats];
    }

    // Kui on vaja mitut istet ja need peavad olema kõrvuti
    if (preferences.numberOfSeats > 1 && preferences.seatsNextToEachOther) {
      // Grupeeri istekohad rea järgi
      const seatsByRow = {};
      filteredSeats.forEach(seat => {
        if (!seatsByRow[seat.seatRow]) {
          seatsByRow[seat.seatRow] = [];
        }
        seatsByRow[seat.seatRow].push(seat);
      });

      let consecutiveSeats = [];

      // Otsi kõrvuti asetsevaid istekohti igas reas
      Object.values(seatsByRow).forEach(rowSeats => {
        // Kui on juba leitud piisavalt kõrvuti istekohti, siis jäta vahele
        if (consecutiveSeats.length >= preferences.numberOfSeats) {
          return;
        }

        // Sorteeri istekohad veeru järgi
        rowSeats.sort((a, b) => a.seatColumn.localeCompare(b.seatColumn));

        // Otsi järjestikuseid istmeid
        for (let i = 0; i <= rowSeats.length - preferences.numberOfSeats; i++) {
          let areConsecutive = true;

          for (let j = 0; j < preferences.numberOfSeats - 1; j++) {
            const currentCol = rowSeats[i + j].seatColumn.charCodeAt(0);
            const nextCol = rowSeats[i + j + 1].seatColumn.charCodeAt(0);

            if (nextCol - currentCol !== 1) {
              areConsecutive = false;
              break;
            }
          }

          if (areConsecutive) {
            consecutiveSeats = rowSeats.slice(i, i + preferences.numberOfSeats);
            break;
          }
        }
      });

      // Kui leidsime sobivad kõrvuti istuvad istekohad
      if (consecutiveSeats.length === preferences.numberOfSeats) {
        filteredSeats = consecutiveSeats;
        console.log("Found adjacent seats:", consecutiveSeats.length);
      } else {
        console.log("Could not find enough adjacent seats, using individual seats");
        // Kui kõrvuti istuvaid kohti ei leitud, võta lihtsalt vajalik arv kohti
        filteredSeats = filteredSeats.slice(0, preferences.numberOfSeats);
      }
    } else {
      // Kui kõrvuti istuvaid kohti pole vaja, võta lihtsalt vajalik arv kohti
      filteredSeats = filteredSeats.slice(0, preferences.numberOfSeats);
    }

    console.log("Final recommended seats:", filteredSeats.length); // Debugging
    console.log("Recommended seat IDs:", filteredSeats.map(s => s.id)); // Debugging

    setRecommendedSeats(filteredSeats);
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
        const data = await fetchFlightSeats(selectedFlight.id);

        // Generate new randomly occupied seats
        const randomlyOccupiedSeats = generateRandomlyOccupiedSeats(data);

        setSeats(randomlyOccupiedSeats);
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