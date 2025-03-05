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
        setPreferences({
            ...preferences,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onPreferencesChange(preferences);
    };

    return (
        <div className="seat-preferences">
            <h2>Seat Preferences</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Number of Seats:</label>
                    <input
                        type="number"
                        name="numberOfSeats"
                        min="1"
                        max="9"
                        value={preferences.numberOfSeats}
                        onChange={handleInputChange}
                    />
                </div>

                {preferences.numberOfSeats > 1 && (
                    <div className="form-group checkbox">
                        <input
                            type="checkbox"
                            name="seatsNextToEachOther"
                            checked={preferences.seatsNextToEachOther}
                            onChange={handleInputChange}
                            id="seatsNextToEachOther"
                        />
                        <label htmlFor="seatsNextToEachOther">Seats Next to Each Other</label>
                    </div>
                )}

                <div className="form-group checkbox">
                    <input
                        type="checkbox"
                        name="preferWindow"
                        checked={preferences.preferWindow}
                        onChange={handleInputChange}
                        id="preferWindow"
                    />
                    <label htmlFor="preferWindow">Window Seat</label>
                </div>

                <div className="form-group checkbox">
                    <input
                        type="checkbox"
                        name="preferExtraLegroom"
                        checked={preferences.preferExtraLegroom}
                        onChange={handleInputChange}
                        id="preferExtraLegroom"
                    />
                    <label htmlFor="preferExtraLegroom">Extra Legroom</label>
                </div>

                <div className="form-group checkbox">
                    <input
                        type="checkbox"
                        name="preferEmergencyExit"
                        checked={preferences.preferEmergencyExit}
                        onChange={handleInputChange}
                        id="preferEmergencyExit"
                    />
                    <label htmlFor="preferEmergencyExit">Near Emergency Exit</label>
                </div>

                <button type="submit" className="preference-button">Find Recommended Seats</button>
            </form>
        </div>
    );
};

export default SeatPreferences;