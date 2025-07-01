document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const modal = document.getElementById('booking-modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const confirmBookingBtn = document.getElementById('confirm-booking');
    const ticketModal = document.getElementById('ticket-modal');
    const closeTicketModal = document.getElementsByClassName('close-ticket')[0];
    const classSelect = document.getElementById('class');
    let selectedBus = null;
    let selectedSeats = [];
    let selectedClass = null;

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Fetch form values
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const departure = document.getElementById('departure').value;
        const destination = document.getElementById('destination').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const price = document.getElementById('price').value;
        const seatPreference = document.getElementById('seat-preference').value;
        selectedClass = classSelect.value;

        // Validate inputs
        if (!name || !phone || !departure || !destination || !date || !selectedClass) {
            alert('Please fill in all required fields.');
            return;
        }

        displayBuses();
    });

    // Function to display available buses
    function displayBuses() {
        const results = document.getElementById('results');
        results.innerHTML = '';

        const buses = [
            { id: 1, from: 'Bengaluru', to: 'Hyderabad', date: '2024-07-01', time: '10:00 AM', priceNonac: 500, priceAc: 1200 },
            { id: 2, from: 'Bhopal', to: 'Indore', date: '2024-07-01', time: '1:00 PM', priceAc: 1600, priceNonac: 3000 }
        ];

        buses.forEach(bus => {
            const busDiv = document.createElement('div');
            busDiv.className = 'bus';
            busDiv.innerHTML = `
                <p>Bus from ${bus.from} to ${bus.to}</p>
                <p>Date: ${bus.date}</p>
                <p>Time: ${bus.time}</p>
                <p>AC Price: $${bus.priceAc}</p>
                <p>Non-AC Price: $${bus.priceNonac}</p>
                <button onclick="selectBus(${bus.id})">Book Now</button>
            `;
            results.appendChild(busDiv);
        });
    }

    // Select bus
    window.selectBus = function (busId) {
        selectedBus = busId;
        selectedSeats = [];
        showModal();
    };

    // Show modal with seat map
    function showModal() {
        modal.style.display = 'block';
        const seatMap = document.getElementById('seat-map');
        seatMap.innerHTML = '';

        const seats = Array.from({ length: 20 }, (_, i) => {
            const id = i + 1;
            const status = (id === 2 || id === 5 || id === 7) ? (id === 5 ? 'under-booking' : 'booked') : 'available';
            return { id, status };
        });

        seats.forEach(seat => {
            const seatDiv = document.createElement('div');
            seatDiv.className = `seat ${seat.status}`;
            seatDiv.innerText = seat.id;
            seatDiv.dataset.seatId = seat.id;
            seatDiv.addEventListener('click', () => selectSeat(seat.id, seat.status));
            seatMap.appendChild(seatDiv);
        });
    }

    // Select seat
    function selectSeat(seatId, status) {
        if (status === 'booked' || status === 'under-booking') return;

        const seatElement = document.querySelector(`[data-seat-id="${seatId}"]`);
        if (!seatElement) return;

        const index = selectedSeats.indexOf(seatId);
        if (index > -1) {
            selectedSeats.splice(index, 1);
            seatElement.classList.remove('selected');
        } else {
            selectedSeats.push(seatId);
            seatElement.classList.add('selected');
        }
    }

    // Close modal
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Close ticket modal
    closeTicketModal.onclick = () => {
        ticketModal.style.display = 'none';
    };

    // Confirm booking
    confirmBookingBtn.onclick = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat.');
            return;
        }

        const paymentForm = document.getElementById('payment-form');
        const cardNumber = paymentForm['card-number'].value;
        const expiryDate = paymentForm['expiry-date'].value;
        const cvv = paymentForm['cvv'].value;
        const cardHolder = paymentForm['card-holder'].value;

        if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
            alert('Please fill in all payment details.');
            return;
        }

        alert('Booking confirmed!');
        modal.style.display = 'none';
        displayTicketDetails();
    };

    // Display ticket
    function displayTicketDetails() {
        ticketModal.style.display = 'block';
        const ticketDetails = document.getElementById('ticket-details');
        ticketDetails.innerHTML = `
            <h3>Ticket Details</h3>
            <p>Bus ID: ${selectedBus}</p>
            <p>Class: ${selectedClass}</p>
            <p>Seats: ${selectedSeats.join(', ')}</p>
            <p>Passenger Name: ${document.getElementById('name').value}</p>
            <p>Phone Number: ${document.getElementById('phone').value}</p>
            <p>Departure City: ${document.getElementById('departure').value}</p>
            <p>Destination City: ${document.getElementById('destination').value}</p>
            <p>Departure Date: ${document.getElementById('date').value}</p>
            <p>Preferred Time: ${document.getElementById('time').value}</p>
            <p>Seat Preference: ${document.getElementById('seat-preference').value}</p>
        `;
    }
});
