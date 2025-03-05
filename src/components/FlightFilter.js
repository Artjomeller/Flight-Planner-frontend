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

    const clearFilters = () => {
        setFilters({
            destination: '',
            date: '',
            departureTimeFrom: '',
            departureTimeTo: '',
            maxPrice: ''
        });
    };

    return (
        <div className="flight-filter">
            <form onSubmit={handleSubmit}>
                <div className="filter-grid">
                    <div className="filter-item">
                        <label htmlFor="destination">Destination</label>
                        <input
                            id="destination"
                            type="text"
                            name="destination"
                            value={filters.destination}
                            onChange={handleInputChange}
                            placeholder="Where to?"
                        />
                    </div>

                    <div className="filter-item">
                        <label htmlFor="date">Date</label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="filter-item">
                        <label htmlFor="departureTimeFrom">Departure From</label>
                        <input
                            id="departureTimeFrom"
                            type="time"
                            name="departureTimeFrom"
                            value={filters.departureTimeFrom}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="filter-item">
                        <label htmlFor="departureTimeTo">Departure To</label>
                        <input
                            id="departureTimeTo"
                            type="time"
                            name="departureTimeTo"
                            value={filters.departureTimeTo}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="filter-item">
                        <label htmlFor="maxPrice">Max Price (€)</label>
                        <input
                            id="maxPrice"
                            type="number"
                            name="maxPrice"
                            min="0"
                            value={filters.maxPrice}
                            onChange={handleInputChange}
                            placeholder="e.g. 200"
                        />
                    </div>

                    <div className="filter-actions">
                        <button type="button" className="clear-button" onClick={clearFilters}>
                            Clear
                        </button>
                        <button type="submit" className="filter-button">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FlightFilter;