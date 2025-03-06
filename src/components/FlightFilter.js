import React, { useState, useEffect } from 'react';
import '../styles/FlightFilter.css';

const FlightFilter = ({ onFilterChange, availableFlights }) => {
    const [filters, setFilters] = useState({
        origin: '',
        destination: '',
        date: '',
        departureTimeFrom: '',
        departureTimeTo: '',
        maxPrice: ''
    });

    const [showOriginDropdown, setShowOriginDropdown] = useState(false);
    const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
    const [showTimeFromDropdown, setShowTimeFromDropdown] = useState(false);
    const [showTimeToDropdown, setShowTimeToDropdown] = useState(false);
    const [showDateOptions, setShowDateOptions] = useState(false);

    // Populaarsed linnad (neid saaks pärida ka API kaudu)
    const popularCities = [
        'Tallinn', 'Helsinki', 'Stockholm', 'Copenhagen',
        'London', 'Paris', 'Berlin', 'Rome', 'Barcelona',
        'Madrid', 'Vienna', 'Prague', 'Amsterdam', 'Brussels'
    ];

    // Filtereeritud linnad kasutaja sisestuse põhjal
    const filteredOrigins = popularCities.filter(
        city => city.toLowerCase().includes(filters.origin.toLowerCase())
    );

    // Filtereeritud sihtkohad kasutaja sisestuse põhjal
    const filteredDestinations = popularCities.filter(
        dest => dest.toLowerCase().includes(filters.destination.toLowerCase())
    );

    // Levinud ajavahemikud
    const commonTimePeriods = [
        { label: 'Morning (6:00-10:00)', from: '06:00', to: '10:00' },
        { label: 'Lunch (10:00-14:00)', from: '10:00', to: '14:00' },
        { label: 'Night (14:00-18:00)', from: '14:00', to: '18:00' },
        { label: 'Midnight (18:00-23:00)', from: '18:00', to: '23:00' }
    ];

    // Kiirvalikud kuupäevade jaoks
    const dateOptions = [
        { label: 'Today', value: new Date().toISOString().split('T')[0] },
        { label: 'Tommorow', value: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
        { label: 'This weekend', value: getNextWeekendDate() }
    ];

    // Abifunktsioon järgmise nädalavahetuse kuupäeva leidmiseks
    function getNextWeekendDate() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 on pühapäev, 6 on laupäev
        const daysUntilSaturday = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
        const nextSaturday = new Date(today);
        nextSaturday.setDate(today.getDate() + daysUntilSaturday);
        return nextSaturday.toISOString().split('T')[0];
    }

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
            origin: '',
            destination: '',
            date: '',
            departureTimeFrom: '',
            departureTimeTo: '',
            maxPrice: ''
        });

        // Sulge kõik dropdownid
        setShowOriginDropdown(false);
        setShowDestinationDropdown(false);
        setShowTimeFromDropdown(false);
        setShowTimeToDropdown(false);
        setShowDateOptions(false);
    };

    const selectOrigin = (origin) => {
        setFilters({
            ...filters,
            origin
        });
        setShowOriginDropdown(false);
    };

    const selectDestination = (destination) => {
        setFilters({
            ...filters,
            destination
        });
        setShowDestinationDropdown(false);
    };

    const selectTimePeriod = (from, to) => {
        setFilters({
            ...filters,
            departureTimeFrom: from,
            departureTimeTo: to
        });
        setShowTimeFromDropdown(false);
        setShowTimeToDropdown(false);
    };

    const selectDate = (date) => {
        setFilters({
            ...filters,
            date
        });
        setShowDateOptions(false);
    };

    // Sulgeme dropdown kui kasutaja klikib mujale
    useEffect(() => {
        const handleOutsideClick = () => {
            setShowOriginDropdown(false);
            setShowDestinationDropdown(false);
            setShowTimeFromDropdown(false);
            setShowTimeToDropdown(false);
            setShowDateOptions(false);
        };

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    // Dropdowni avamiseks ilma, et event jõuaks dokumentideni
    const handleDropdownClick = (e, dropdownSetter) => {
        e.stopPropagation();
        dropdownSetter(prev => !prev);
    };

    return (
        <div className="flight-filter">
            <form onSubmit={handleSubmit}>
                <div className="filter-grid">
                    <div className="filter-item">
                        <label htmlFor="origin">Departure City</label>
                        <div className="dropdown-container">
                            <input
                                id="origin"
                                type="text"
                                name="origin"
                                value={filters.origin}
                                onChange={handleInputChange}
                                placeholder="Where from?"
                                onClick={(e) => handleDropdownClick(e, setShowOriginDropdown)}
                            />
                            {showOriginDropdown && (
                                <div className="dropdown-menu">
                                    {filteredOrigins.length > 0 ? (
                                        filteredOrigins.map(city => (
                                            <div
                                                key={city}
                                                className="dropdown-item"
                                                onClick={() => selectOrigin(city)}
                                            >
                                                {city}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="dropdown-item no-results">No cities found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="filter-item">
                        <label htmlFor="destination">Destination</label>
                        <div className="dropdown-container">
                            <input
                                id="destination"
                                type="text"
                                name="destination"
                                value={filters.destination}
                                onChange={handleInputChange}
                                placeholder="Where to?"
                                onClick={(e) => handleDropdownClick(e, setShowDestinationDropdown)}
                            />
                            {showDestinationDropdown && (
                                <div className="dropdown-menu">
                                    {filteredDestinations.length > 0 ? (
                                        filteredDestinations.map(dest => (
                                            <div
                                                key={dest}
                                                className="dropdown-item"
                                                onClick={() => selectDestination(dest)}
                                            >
                                                {dest}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="dropdown-item no-results">No destinations found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="filter-item">
                        <label htmlFor="date">Date</label>
                        <div className="dropdown-container">
                            <input
                                id="date"
                                type="date"
                                name="date"
                                value={filters.date}
                                onChange={handleInputChange}
                                onClick={(e) => handleDropdownClick(e, setShowDateOptions)}
                            />
                            {showDateOptions && (
                                <div className="dropdown-menu">
                                    {dateOptions.map(option => (
                                        <div
                                            key={option.label}
                                            className="dropdown-item"
                                            onClick={() => selectDate(option.value)}
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="filter-item">
                        <label htmlFor="departureTimeFrom">Departure From</label>
                        <div className="dropdown-container">
                            <input
                                id="departureTimeFrom"
                                type="time"
                                name="departureTimeFrom"
                                value={filters.departureTimeFrom}
                                onChange={handleInputChange}
                                onClick={(e) => handleDropdownClick(e, setShowTimeFromDropdown)}
                            />
                            {showTimeFromDropdown && (
                                <div className="dropdown-menu time-dropdown">
                                    <div className="dropdown-item dropdown-header">Common time periods:</div>
                                    {commonTimePeriods.map(period => (
                                        <div
                                            key={period.label}
                                            className="dropdown-item"
                                            onClick={() => selectTimePeriod(period.from, period.to)}
                                        >
                                            {period.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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