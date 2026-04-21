document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    if (window.scrollY > 20) navbar.classList.add('scrolled');

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Check auth for nav
    const user = Storage.getUser();
    if (user) {
        document.getElementById('navAuth').innerHTML = `<a href="./pages/dashboard.html" class="btn btn-primary">Dashboard</a>`;
        document.getElementById('mobileNavAuth').innerHTML = `<a href="./pages/dashboard.html" class="btn btn-primary">Dashboard</a>`;
    }

    // Render Specialties
    function renderSpecialties() {
        const grid = document.getElementById('specGrid');
        if(!grid) return;
        grid.innerHTML = SPECIALTIES.map(s => `
            <div class="specialty-card" onclick="filterBySpecialty('${s.name}')">
                <div class="icon">${s.icon}</div>
                <h3>${s.name}</h3>
            </div>
        `).join('');
    }

    let activeFilter = 'All';
    let searchQuery = '';

    function renderFilterBar() {
        const bar = document.getElementById('filterBar');
        if(!bar) return;
        const filters = ['All', ...SPECIALTIES.slice(0, 5).map(s => s.name)];
        bar.innerHTML = filters.map(f => `
            <button class="filter-btn ${activeFilter === f ? 'active' : ''}" onclick="setFilter('${f}')">${f}</button>
        `).join('');
    }

    window.setFilter = function(f) {
        activeFilter = f;
        renderFilterBar();
        renderDoctors();
    };

    window.filterBySpecialty = function(name) {
        setFilter(name);
        document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' });
    };

    function renderDoctors() {
        const grid = document.getElementById('doctorsGrid');
        if(!grid) return;
        
        let filtered = DOCTORS;
        if (activeFilter !== 'All') {
            filtered = filtered.filter(d => d.specialty === activeFilter);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q));
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No doctors found.</p>`;
            return;
        }

        grid.innerHTML = filtered.map(d => `
            <div class="doctor-card">
                <div class="doctor-header">
                    <div class="avatar" style="background: ${d.gradient}">${d.initials}</div>
                    <div class="availability ${d.available ? 'available' : 'unavailable'}">
                        ${d.available ? 'Available' : 'Unavailable'}
                    </div>
                </div>
                <h3>${d.name}</h3>
                <p class="specialty">${d.specialty} • ${d.experience}</p>
                <div class="doctor-stats">
                    <span>⭐ ${d.rating} (${d.reviews})</span>
                    <span>📍 ${d.location}</span>
                </div>
                <div class="doctor-footer">
                    <span class="fee">${d.fee}</span>
                    <button class="btn btn-primary btn-sm" onclick="openBookingModal('${d.id}')" ${!d.available ? 'disabled' : ''}>
                        Book Appointment
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Hero search
    const btnFindDoctor = document.getElementById('btnFindDoctor');
    const heroSearch = document.getElementById('heroSearch');
    if (btnFindDoctor && heroSearch) {
        btnFindDoctor.addEventListener('click', () => {
            searchQuery = heroSearch.value;
            renderDoctors();
            document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' });
        });
        heroSearch.addEventListener('keyup', (e) => {
            if(e.key === 'Enter') {
                searchQuery = heroSearch.value;
                renderDoctors();
                document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Booking logic
    let selectedSlot = null;

    window.openBookingModal = function(doctorId) {
        if (!Storage.getUser()) {
            showToast('Please login to book an appointment');
            setTimeout(() => {
                window.location.href = './pages/login.html';
            }, 1500);
            return;
        }

        const doctor = DOCTORS.find(d => d.id === doctorId);
        if(!doctor) return;
        selectedSlot = null;

        const container = document.getElementById('modalContainer');
        container.innerHTML = `
            <div class="modal-overlay active" id="bookingModalOverlay">
                <div class="modal-content">
                    <h2>Book Appointment</h2>
                    <div class="modal-doc-info">
                        <div class="avatar" style="background: ${doctor.gradient}">${doctor.initials}</div>
                        <div>
                            <h3>${doctor.name}</h3>
                            <p>${doctor.specialty} • ${doctor.fee}</p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Patient Name</label>
                        <input type="text" id="bookName" value="${Storage.getUser().name}" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="bookDate" class="input-field">
                    </div>
                    <div class="form-group">
                        <label>Select Time Slot</label>
                        <div class="slot-grid">
                            ${doctor.slots.map(s => `<button class="slot-btn" onclick="selectSlot(this, '${s}')">${s}</button>`).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Reason for visit</label>
                        <input type="text" id="bookReason" class="input-field" placeholder="e.g. Regular checkup">
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="confirmBooking('${doctor.id}')">Confirm</button>
                    </div>
                </div>
            </div>
        `;

        // set min date
        const dateInput = document.getElementById('bookDate');
        if(dateInput) dateInput.min = new Date().toISOString().split('T')[0];
    };

    window.selectSlot = function(btn, slot) {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSlot = slot;
    };

    window.closeModal = function() {
        const overlay = document.getElementById('bookingModalOverlay');
        if(overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                document.getElementById('modalContainer').innerHTML = '';
            }, 300);
        }
    };

    window.confirmBooking = function(doctorId) {
        const name = document.getElementById('bookName').value.trim();
        const date = document.getElementById('bookDate').value;
        const reason = document.getElementById('bookReason').value.trim();

        if(!name || !date || !selectedSlot) {
            showToast('Please fill all required fields and select a slot');
            return;
        }

        const doctor = DOCTORS.find(d => d.id === doctorId);
        
        Storage.saveAppointment({
            doctorId,
            doctorName: doctor.name,
            doctorSpecialty: doctor.specialty,
            patientName: name,
            date,
            time: selectedSlot,
            reason,
            fee: doctor.fee
        });

        closeModal();
        showToast('Appointment booked successfully!');
    };

    window.showToast = function(msg) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerText = msg;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Init
    renderSpecialties();
    renderFilterBar();
    renderDoctors();
});
