import React, { useState } from 'react';
import '../styles/FlightFilter.css';

const FlightFilter = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        destination: '',
        date: '',
        departureTimeFrom: '',
        departureTimeTo: '',
        maxPrice: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterChange(filters);
    };

    return (
        <div className="flight-filter">
            <h2>Filter Flights</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Destination:</label>
                    <input
                        type="text"
                        name="destination"
                        value={filters.destination}
                        onChange={handleInputChange}
                        placeholder="Where to?"
                    />
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Departure time from:</label>
                    <input
                        type="time"
                        name="departureTimeFrom"
                        value={filters.departureTimeFrom}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Departure time to:</label>
                    <input
                        type="time"
                        name="departureTimeTo"
                        value={filters.departureTimeTo}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Max price:</label>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleInputChange}
                        placeholder="Maximum price"
                    />
                </div>
                <button type="submit" className="filter-button">Apply Filters</button>
            </form>
        </div>
    );
};

export default FlightFilter;