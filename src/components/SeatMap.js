import React from 'react';
import '../styles/SeatMap.css';

const SeatMap = ({ seats, selectedSeats, recommendedSeats, onSeatClick, onRegenerateSeats }) => {
    // Group seats by row
    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
        acc[seat.seatRow].push(seat);
        return acc;
    }, {});

    // Sort rows
    const sortedRows = Object.keys(seatsByRow).sort((a, b) => parseInt(a) - parseInt(b));

    // Check if a seat is recommended
    const isRecommended = (seat) => {
        // Debug log
        if (recommendedSeats.length > 0 && seat.id === recommendedSeats[0].id) {
            console.log("Checking if seat is recommended:", seat.id, recommendedSeats.some(recSeat => recSeat.id === seat.id));
        }
        return recommendedSeats.some(recSeat => recSeat.id === seat.id);
    };

    // Check if a seat is selected
    const isSelected = (seat) => {
        return selectedSeats.some(selSeat => selSeat.id === seat.id);
    };

    // Get seat class based on its properties
    const getSeatClass = (seat) => {
        let classes = ['seat'];

        if (seat.isOccupied) {
            classes.push('occupied');
        } else {
            classes.push('available');

            if (isSelected(seat)) {
                classes.push('selected');
            } else if (isRecommended(seat)) {
                classes.push('recommended');
            }
        }

        if (seat.isWindow) classes.push('window');
        if (seat.isEmergencyExit) classes.push('emergency-exit');
        if (seat.hasExtraLegroom) classes.push('extra-legroom');

        return classes.join(' ');
    };

    // Count different seat types
    const seatCounts = seats.reduce((acc, seat) => {
        if (seat.isOccupied) {
            acc.occupied++;
        } else {
            acc.available++;
            if (seat.isWindow) acc.window++;
            if (seat.isEmergencyExit) acc.emergencyExit++;
            if (seat.hasExtraLegroom) acc.extraLegroom++;
        }
        return acc;
    }, {
        total: seats.length,
        available: 0,
        occupied: 0,
        window: 0,
        emergencyExit: 0,
        extraLegroom: 0,
        recommended: recommendedSeats.length,
        selected: selectedSeats.length
    });

    // Get tooltip text for a seat
    const getSeatTooltip = (seat) => {
        const status = seat.isOccupied ? 'Occupied' : 'Available';
        const features = [];

        if (seat.isWindow) features.push('Window');
        if (seat.isEmergencyExit) features.push('Emergency Exit');
        if (seat.hasExtraLegroom) features.push('Extra Legroom');

        return `Seat ${seat.seatNumber}: ${status}${features.length > 0 ? ' (' + features.join(', ') + ')' : ''}`;
    };

    return (
        <div className="seat-map">
            <div className="seat-map-header">
                <h2>Seat Map</h2>
                {onRegenerateSeats && (
                    <button className="regenerate-button" onClick={onRegenerateSeats}>
                        Regenerate Seats
                    </button>
                )}
            </div>

            <div className="seat-stats">
                <div className="stat-item">
                    <span className="stat-value">{seatCounts.total}</span>
                    <span className="stat-label">Total Seats</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{seatCounts.available}</span>
                    <span className="stat-label">Available</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{seatCounts.occupied}</span>
                    <span className="stat-label">Occupied</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{seatCounts.window}</span>
                    <span className="stat-label">Window Seats</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{seatCounts.extraLegroom}</span>
                    <span className="stat-label">Extra Legroom</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{seatCounts.emergencyExit}</span>
                    <span className="stat-label">Near Exit</span>
                </div>
            </div>

            <div className="legend">
                <div className="legend-title">Seat Types</div>
                <div className="legend-grid">
                    <div className="legend-item">
                        <div className="legend-icon available"></div>
                        <span>Available</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-icon occupied"></div>
                        <span>Occupied</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-icon recommended"></div>
                        <span>Recommended</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-icon selected"></div>
                        <span>Selected</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-icon window"></div>
                        <span>Window Seat</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-icon emergency-exit"></div>
                        <span>Emergency Exit</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-icon extra-legroom"></div>
                        <span>Extra Legroom</span>
                    </div>
                </div>
            </div>

            <div className="airplane">
                <div className="fuselage"></div>

                <div className="seats">
                    {sortedRows.map((row) => (
                        <div key={row} className="seat-row">
                            <div className="row-number">{row}</div>
                            {seatsByRow[row]
                                .sort((a, b) => a.seatColumn.localeCompare(b.seatColumn))
                                .map((seat) => (
                                    <div
                                        key={seat.id}
                                        className={getSeatClass(seat)}
                                        onClick={() => !seat.isOccupied && onSeatClick(seat)}
                                        title={getSeatTooltip(seat)}
                                    >
                                        {seat.seatColumn}
                                        {seat.isWindow && <span className="seat-feature window-feature"></span>}
                                        {seat.hasExtraLegroom && <span className="seat-feature legroom-feature"></span>}
                                        {seat.isEmergencyExit && <span className="seat-feature exit-feature"></span>}
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

                <div className="fuselage"></div>
            </div>
        </div>
    );
};

export default SeatMap;