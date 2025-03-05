import React from 'react';
import '../styles/SeatMap.css';

const SeatMap = ({ seats, selectedSeats, recommendedSeats, onSeatClick }) => {
    // Group seats by row
    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.seatRow]) acc[seat.seatRow] = [];
        acc[seat.seatRow].push(seat);
        return acc;
    }, {});

    // Sort rows
    const sortedRows = Object.keys(seatsByRow).sort();

    // Check if a seat is recommended
    const isRecommended = (seat) => {
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

            if (seat.isWindow) classes.push('window');
            if (seat.isEmergencyExit) classes.push('emergency-exit');
            if (seat.hasExtraLegroom) classes.push('extra-legroom');
        }

        return classes.join(' ');
    };

    return (
        <div className="seat-map">
            <h2>Seat Map</h2>

            <div className="legend">
                <div className="legend-item">
                    <div className="seat-icon available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="seat-icon occupied"></div>
                    <span>Occupied</span>
                </div>
                <div className="legend-item">
                    <div className="seat-icon recommended"></div>
                    <span>Recommended</span>
                </div>
                <div className="legend-item">
                    <div className="seat-icon selected"></div>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <div className="seat-icon window"></div>
                    <span>Window</span>
                </div>
                <div className="legend-item">
                    <div className="seat-icon emergency-exit"></div>
                    <span>Emergency Exit</span>
                </div>
                <div className="legend-item">
                    <div className="seat-icon extra-legroom"></div>
                    <span>Extra Legroom</span>
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
                                        title={`${seat.seatNumber} ${seat.isOccupied ? '(Occupied)' : '(Available)'}`}
                                    >
                                        {seat.seatColumn}
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