import React from 'react';
import '../styles/FlightList.css';

const FlightList = ({ flights, onSelectFlight }) => {
    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleString();
    };

    return (
        <div className="flight-list">
            <h2>Available Flights</h2>
            {flights.length === 0 ? (
                <p>No flights found matching your criteria.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Flight</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {flights.map(flight => (
                        <tr key={flight.id}>
                            <td>{flight.flightNumber}</td>
                            <td>{flight.origin}</td>
                            <td>{flight.destination}</td>
                            <td>{formatDateTime(flight.departureTime)}</td>
                            <td>{formatDateTime(flight.arrivalTime)}</td>
                            <td>€{flight.price.toFixed(2)}</td>
                            <td>
                                <button onClick={() => onSelectFlight(flight)}>
                                    Select
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FlightList;