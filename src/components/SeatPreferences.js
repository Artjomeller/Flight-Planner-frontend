import React, { useState } from 'react';
import '../styles/SeatPreferences.css';

const SeatPreferences = ({ flightId, onPreferencesChange }) => {
    const [preferences, setPreferences] = useState({
        flightId: flightId,
        preferWindow: false,
        preferExtraLegroom: false,
        preferEmergencyExit: false,
        numberOfSeats: 1,
        seatsNextToEachOther: true
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) : value);

        const updatedPreferences = {
            ...preferences,
            [name]: newValue
        };

        setPreferences(updatedPreferences);

        // If we change number of seats and it's now 1, adjacent seats option doesn't apply
        if (name === 'numberOfSeats' && newValue === 1) {
            setPreferences(prev => ({...prev, seatsNextToEachOther: true}));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onPreferencesChange(preferences);
    };

    return (
        <div className="seat-preferences">
            <h2>Seat Preferences</h2>
            <p className="preference-intro">Select your preferences to get seat recommendations</p>

            <form onSubmit={handleSubmit}>
                <div className="preference-group ticket-count">
                    <label htmlFor="numberOfSeats">Number of Seats</label>
                    <input
                        id="numberOfSeats"
                        type="number"
                        name="numberOfSeats"
                        min="1"
                        max="9"
                        value={preferences.numberOfSeats}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="preferences-grid">
                    <div className="preference-option">
                        <input
                            type="checkbox"
                            id="preferWindow"
                            name="preferWindow"
                            checked={preferences.preferWindow}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="preferWindow">
                            <div className="option-icon window-icon"></div>
                            <div className="option-label">Window Seat</div>
                        </label>
                    </div>

                    <div className="preference-option">
                        <input
                            type="checkbox"
                            id="preferExtraLegroom"
                            name="preferExtraLegroom"
                            checked={preferences.preferExtraLegroom}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="preferExtraLegroom">
                            <div className="option-icon legroom-icon"></div>
                            <div className="option-label">Extra Legroom</div>
                        </label>
                    </div>

                    <div className="preference-option">
                        <input
                            type="checkbox"
                            id="preferEmergencyExit"
                            name="preferEmergencyExit"
                            checked={preferences.preferEmergencyExit}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="preferEmergencyExit">
                            <div className="option-icon exit-icon"></div>
                            <div className="option-label">Near Emergency Exit</div>
                        </label>
                    </div>

                    {preferences.numberOfSeats > 1 && (
                        <div className="preference-option">
                            <input
                                type="checkbox"
                                id="seatsNextToEachOther"
                                name="seatsNextToEachOther"
                                checked={preferences.seatsNextToEachOther}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="seatsNextToEachOther">
                                <div className="option-icon adjacent-icon"></div>
                                <div className="option-label">Seats Next to Each Other</div>
                            </label>
                        </div>
                    )}
                </div>

                <button type="submit" className="recommend-button">Find Recommended Seats</button>
            </form>
        </div>
    );
};

export default SeatPreferences;