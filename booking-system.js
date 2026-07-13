// booking-system.js - Centralized Booking System for UCCEC

// ===== BOOKINGS STORAGE =====
const BOOKINGS_KEY = 'uccec_bookings';

function getBookings() {
    try {
        return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
    } catch {
        return [];
    }
}

function saveBookings(bookings) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function addBooking(title, price, date, image = '') {
    const bookings = getBookings();
    bookings.unshift({
        id: Date.now(),
        title: title,
        price: price,
        date: date,
        image: image,
        bookedAt: new Date().toLocaleString(),
        status: 'Pending Payment',
        paymentStatus: 'unpaid'
    });
    saveBookings(bookings);
    updateBookingCount();
    return bookings[0];
}

function updateBookingStatus(id, status, paymentStatus = 'paid') {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
        bookings[index].status = status;
        bookings[index].paymentStatus = paymentStatus;
        saveBookings(bookings);
        updateBookingCount();
    }
}

function getBookingCount() {
    return getBookings().length;
}

function updateBookingCount() {
    const count = getBookingCount();
    document.querySelectorAll('.booking-count').forEach(el => {
        el.textContent = count;
    });
}

function processPayment(bookingId, method) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        booking.status = 'Confirmed';
        booking.paymentStatus = 'paid';
        booking.paidAt = new Date().toLocaleString();
        booking.paymentMethod = method;
        saveBookings(bookings);
        updateBookingCount();
        return true;
    }
    return false;
}

function renderBookings(containerId = 'bookingsList') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const bookings = getBookings();
    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-calendar-plus"></i>
                <p>You have no bookings yet.</p>
                <p style="font-size:13px; margin-top:6px;">Browse our trips and events to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = bookings.map(b => `
        <div class="booking-item" data-id="${b.id}">
            <div class="booking-info">
                <strong>${b.title}</strong>
                <div class="booking-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${b.date}</span>
                    <span><i class="fas fa-tag"></i> ${b.price}</span>
                    <span><i class="fas fa-clock"></i> Booked: ${b.bookedAt}</span>
                </div>
            </div>
            <div class="booking-status">
                <span class="status ${b.paymentStatus === 'paid' ? 'paid' : 'pending'}">
                    ${b.status}
                </span>
                ${b.paymentStatus === 'unpaid' ? `
                    <button class="pay-btn" onclick="openPaymentModal(${b.id})">
                        <i class="fas fa-credit-card"></i> Pay Now
                    </button>
                ` : `
                    <span class="paid-badge"><i class="fas fa-check-circle"></i> Paid</span>
                `}
            </div>
        </div>
    `).join('');
}

function openPaymentModal(bookingId) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    let modal = document.getElementById('paymentModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'paymentModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content payment-modal">
                <button class="modal-close" onclick="closePaymentModal()"><i class="fas fa-times"></i></button>
                <h2>Complete Payment</h2>
                <div id="paymentDetails"></div>
                <div class="payment-methods">
                    <h4>Select Payment Method</h4>
                    <div class="payment-options-grid">
                        <button class="payment-option" onclick="selectPayment('Mobile Money')">
                            <i class="fas fa-mobile-alt"></i> Mobile Money
                        </button>
                        <button class="payment-option" onclick="selectPayment('Credit Card')">
                            <i class="fas fa-credit-card"></i> Credit Card
                        </button>
                        <button class="payment-option" onclick="selectPayment('Bank Transfer')">
                            <i class="fas fa-university"></i> Bank Transfer
                        </button>
                        <button class="payment-option" onclick="selectPayment('PayPal')">
                            <i class="fab fa-paypal"></i> PayPal
                        </button>
                    </div>
                </div>
                <button class="btn-submit" id="confirmPaymentBtn" onclick="confirmPayment()" disabled>
                    <i class="fas fa-lock"></i> Confirm Payment
                </button>
                <p class="payment-note">🔒 Your payment is secure and encrypted.</p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('paymentDetails').innerHTML = `
        <div class="payment-summary">
            <p><strong>${booking.title}</strong></p>
            <p><i class="fas fa-calendar-alt"></i> ${booking.date}</p>
            <p style="font-size:24px; color:#ff8c00; font-weight:800;">${booking.price}</p>
        </div>
    `;

    modal.dataset.bookingId = bookingId;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

let selectedPaymentMethod = null;

function selectPayment(method) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.payment-option').forEach(el => {
        if (el.textContent.includes(method)) {
            el.classList.add('selected');
        }
    });
    document.getElementById('confirmPaymentBtn').disabled = false;
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    selectedPaymentMethod = null;
    document.getElementById('confirmPaymentBtn').disabled = true;
    document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
}

function confirmPayment() {
    const modal = document.getElementById('paymentModal');
    const bookingId = parseInt(modal.dataset.bookingId);
    if (processPayment(bookingId, selectedPaymentMethod)) {
        alert('✅ Payment confirmed successfully!\n\nYour booking is now confirmed.');
        closePaymentModal();
        renderBookings();
        updateBookingCount();
    }
}

function createFloatingBookingIcon() {
    if (document.querySelector('.floating-bookings')) return;

    const icon = document.createElement('div');
    icon.className = 'floating-bookings';
    icon.innerHTML = `
        <button onclick="openBookingPanel()" class="booking-float-btn">
            <i class="fas fa-calendar-check"></i>
            <span class="booking-badge booking-count">0</span>
        </button>
    `;
    document.body.appendChild(icon);
    updateBookingCount();
}

function openBookingPanel() {
    let panel = document.getElementById('bookingPanel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'bookingPanel';
        panel.className = 'booking-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h2><i class="fas fa-calendar-check"></i> My Bookings</h2>
                <button class="panel-close" onclick="closeBookingPanel()"><i class="fas fa-times"></i></button>
            </div>
            <div class="panel-body" id="panelBookingsList"></div>
            <div class="panel-footer">
                <p>Total: <span id="panelTotal">0</span> bookings</p>
                <button class="btn-clear" onclick="clearBookings()">Clear All</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    renderBookings('panelBookingsList');
    document.getElementById('panelTotal').textContent = getBookingCount();
    panel.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingPanel() {
    const panel = document.getElementById('bookingPanel');
    if (panel) panel.classList.remove('active');
    document.body.style.overflow = '';
}

function clearBookings() {
    if (confirm('Are you sure you want to clear all bookings?')) {
        localStorage.removeItem(BOOKINGS_KEY);
        updateBookingCount();
        renderBookings('panelBookingsList');
        document.getElementById('panelTotal').textContent = 0;
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    createFloatingBookingIcon();
    updateBookingCount();

    document.addEventListener('click', function(e) {
        const panel = document.getElementById('bookingPanel');
        if (panel && panel.classList.contains('active') && !panel.contains(e.target) && !e.target.closest('.booking-float-btn')) {
            closeBookingPanel();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBookingPanel();
            closePaymentModal();
        }
    });
});

// ===== STYLES =====
(function injectStyles() {
    const styles = `
        .floating-bookings {
            position: fixed;
            bottom: 100px;
            right: 28px;
            z-index: 9998;
        }
        .booking-float-btn {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #c8102e, #ff7b00);
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 8px 30px rgba(200,16,46,0.4);
            transition: all 0.3s ease;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .booking-float-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(200,16,46,0.5);
        }
        .booking-float-btn .booking-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #c8102e;
            color: white;
            font-size: 12px;
            font-weight: 700;
            min-width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #0a0a0a;
        }
        .booking-panel {
            position: fixed;
            top: 0;
            right: -420px;
            width: 400px;
            height: 100vh;
            background: #141414;
            z-index: 10000;
            transition: right 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
            border-left: 1px solid rgba(255,255,255,0.06);
            display: flex;
            flex-direction: column;
            box-shadow: -10px 0 40px rgba(0,0,0,0.5);
        }
        .booking-panel.active { right: 0; }
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            flex-shrink: 0;
        }
        .panel-header h2 { font-size: 24px; font-weight: 700; color: white; }
        .panel-header h2 i { color: #ff8c00; margin-right: 10px; }
        .panel-close {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.08);
            color: #aaa;
            font-size: 18px;
            cursor: pointer;
            transition: .3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .panel-close:hover { background: #c8102e; color: white; transform: rotate(90deg); }
        .panel-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px 20px;
        }
        .panel-body::-webkit-scrollbar { width: 4px; }
        .panel-body::-webkit-scrollbar-thumb { background: #c8102e; border-radius: 10px; }
        .panel-footer {
            padding: 16px 24px;
            border-top: 1px solid rgba(255,255,255,0.06);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            color: #aaa;
            font-size: 14px;
        }
        .panel-footer .btn-clear {
            background: rgba(200,16,46,0.15);
            border: 1px solid rgba(200,16,46,0.2);
            color: #c8102e;
            padding: 8px 18px;
            border-radius: 30px;
            cursor: pointer;
            transition: .3s;
            font-weight: 600;
            font-size: 13px;
        }
        .panel-footer .btn-clear:hover { background: #c8102e; color: white; }
        .booking-item {
            background: rgba(255,255,255,0.04);
            padding: 14px 16px;
            border-radius: 14px;
            margin-bottom: 10px;
            border-left: 3px solid #ff8c00;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .booking-item .booking-info strong { color: white; font-size: 15px; display: block; }
        .booking-item .booking-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 12px;
            color: #aaa;
        }
        .booking-item .booking-meta i { color: #ff8c00; margin-right: 4px; }
        .booking-item .booking-status {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 4px;
        }
        .booking-item .status {
            padding: 3px 14px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
        }
        .booking-item .status.pending { background: rgba(255,165,0,0.15); color: #ff8c00; }
        .booking-item .status.paid { background: rgba(46,204,113,0.15); color: #2ecc71; }
        .booking-item .pay-btn {
            background: linear-gradient(135deg, #c8102e, #ff7b00);
            border: none;
            color: white;
            padding: 4px 16px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: .3s;
        }
        .booking-item .pay-btn:hover { transform: scale(1.05); }
        .booking-item .paid-badge { color: #2ecc71; font-size: 13px; font-weight: 600; }
        .no-bookings { text-align: center; padding: 40px 20px; color: #888; }
        .no-bookings i { font-size: 3rem; color: #ff8c00; margin-bottom: 14px; display: block; }
        .payment-modal .modal-content { max-width: 500px; }
        .payment-summary {
            background: rgba(255,255,255,0.04);
            padding: 20px;
            border-radius: 16px;
            margin: 12px 0;
            text-align: center;
        }
        .payment-summary p { margin: 4px 0; color: #ddd; }
        .payment-methods { margin: 16px 0; }
        .payment-methods h4 { color: #aaa; font-weight: 500; margin-bottom: 12px; }
        .payment-options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .payment-option {
            padding: 14px;
            border-radius: 14px;
            border: 2px solid rgba(255,255,255,0.06);
            background: rgba(255,255,255,0.03);
            color: #ccc;
            cursor: pointer;
            transition: .3s;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            justify-content: center;
        }
        .payment-option:hover { border-color: rgba(255,165,0,0.2); background: rgba(255,255,255,0.06); }
        .payment-option.selected { border-color: #ff8c00; background: rgba(255,165,0,0.1); color: white; }
        .payment-option i { font-size: 20px; }
        .btn-submit {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 16px;
            background: linear-gradient(135deg, #c8102e, #ff7b00);
            color: white;
            font-size: 17px;
            font-weight: 700;
            cursor: pointer;
            transition: .3s;
            margin-top: 8px;
        }
        .btn-submit:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(200,16,46,0.3);
        }
        .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
        .payment-note { text-align: center; color: #666; font-size: 13px; margin-top: 12px; }
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(16px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            padding: 20px;
        }
        .modal-overlay.active { display: flex; }
        .modal-content {
            background: #1a1a1a;
            border-radius: 28px;
            padding: 30px 32px;
            max-width: 820px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid rgba(255,255,255,0.06);
            animation: modalIn 0.35s ease;
            position: relative;
        }
        @keyframes modalIn {
            from { opacity: 0; transform: scale(0.92) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-close {
            position: sticky;
            top: 0;
            float: right;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(200,16,46,0.15);
            border: 1px solid rgba(200,16,46,0.2);
            color: #ccc;
            font-size: 18px;
            cursor: pointer;
            transition: .3s;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            margin-bottom: 8px;
        }
        .modal-close:hover { background: #c8102e; color: white; transform: rotate(90deg); }
        .modal-content h2 { font-size: 28px; font-weight: 800; margin-top: 4px; color: white; }

        @media (max-width: 600px) {
            .booking-panel { width: 100%; right: -100%; }
            .floating-bookings { bottom: 80px; right: 16px; }
            .booking-float-btn { width: 56px; height: 56px; font-size: 24px; }
            .payment-options-grid { grid-template-columns: 1fr 1fr; }
            .booking-item .booking-meta { gap: 8px; font-size: 11px; }
            .modal-content { padding: 20px; }
        }
        @media (max-width: 400px) {
            .payment-options-grid { grid-template-columns: 1fr; }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
})();

// Expose functions globally
window.getBookings = getBookings;
window.addBooking = addBooking;
window.processPayment = processPayment;
window.renderBookings = renderBookings;
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.confirmPayment = confirmPayment;
window.openBookingPanel = openBookingPanel;
window.closeBookingPanel = closeBookingPanel;
window.clearBookings = clearBookings;
window.updateBookingCount = updateBookingCount;
window.getBookingCount = getBookingCount;
window.selectPayment = selectPayment;