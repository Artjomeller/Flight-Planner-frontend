import React from 'react';
import '../styles/FlightList.css';

const FlightList = ({ flights, onSelectFlight }) => {
    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleString();
    };

    const formatTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleDateString();
    };

    const calculateDuration = (departure, arrival) => {
        const deptTime = new Date(departure);
        const arrTime = new Date(arrival);
        const durationMs = arrTime - deptTime;

        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="flight-list">
            <h2 className="flight-list-title">
                Available Flights
            </h2>

            {flights.length === 0 ? (
                <div className="no-flights">
                    <div className="no-flights-icon"></div>
                    <p>No flights found matching your criteria.</p>
                </div>
            ) : (
                <div className="flight-table-container">
                    <table className="flight-table">
                        <thead>
                        <tr>
                            <th className="flight-number-header">
                                <span className="header-icon flight-number-icon"></span>
                                Flight
                            </th>
                            <th className="origin-header">
                                <span className="header-icon origin-icon"></span>
                                Origin
                            </th>
                            <th className="destination-header">
                                <span className="header-icon destination-icon"></span>
                                Destination
                            </th>
                            <th className="departure-header">
                                <span className="header-icon departure-icon"></span>
                                Departure
                            </th>
                            <th className="arrival-header">
                                <span className="header-icon arrival-icon"></span>
                                Arrival
                            </th>
                            <th className="price-header">
                                <span className="header-icon price-icon"></span>
                                Price
                            </th>
                            <th className="action-header"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {flights.map(flight => (
                            <tr key={flight.id} className="flight-row">
                                <td className="flight-number">
                                    <span className="flight-code">{flight.flightNumber}</span>
                                </td>
                                <td className="origin">
                                    {flight.origin}
                                </td>
                                <td className="destination">
                                    {flight.destination}
                                </td>
                                <td className="departure-time">
                                    {formatDateTime(flight.departureTime)}
                                </td>
                                <td className="arrival-time">
                                    {formatDateTime(flight.arrivalTime)}
                                </td>
                                <td className="price">
                                    <span className="price-amount">€{flight.price.toFixed(2)}</span>
                                </td>
                                <td className="action">
                                    <button className="select-button" onClick={() => onSelectFlight(flight)}>
                                        Select
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FlightList;