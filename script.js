document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const bookFromViewBtn = document.getElementById('book-from-view');
    const heroBookBtn = document.getElementById('hero-book-btn');
    const registerFromLogin = document.getElementById('register-from-login');
    const loginFromRegister = document.getElementById('login-from-register');
    const bookingForm = document.getElementById('booking-form');
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const filterStatus = document.getElementById('filter-status');
    const refreshAppointments = document.getElementById('refresh-appointments');
    const appointmentsList = document.getElementById('appointments-list');
    const printAppointmentBtn = document.getElementById('print-appointment');
    const viewAppointmentsBtn = document.getElementById('view-appointments');
    
    // Calendar instance variable
    let calendar = null;

    // Sample data for doctors and time slots
    const doctorsData = {
        cardiology: [
            { id: 'doc-1', name: 'Dr. Sarah Johnson', availableDays: ['Monday', 'Wednesday', 'Friday'] },
            { id: 'doc-2', name: 'Dr. Robert Smith', availableDays: ['Tuesday', 'Thursday', 'Saturday'] }
        ],
        neurology: [
            { id: 'doc-3', name: 'Dr. Michael Chen', availableDays: ['Monday', 'Tuesday', 'Thursday'] },
            { id: 'doc-4', name: 'Dr. Jennifer Lee', availableDays: ['Wednesday', 'Friday', 'Saturday'] }
        ],
        general: [
            { id: 'doc-5', name: 'Dr. James Brown', availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
            { id: 'doc-6', name: 'Dr. Emily Rodriguez', availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
        ]
    };
    
    // Helper function to find doctor by name
    function findDoctorByName(name) {
        for (const department in doctorsData) {
            const doctor = doctorsData[department].find(doc => doc.name === name);
            if (doctor) {
                return doctor;
            }
        }
        return null;
    }

    // Function to update calendar with doctor's available days
    function updateCalendar(doctorName) {
        if (calendar) {
            calendar.destroy();
        }

        const doctor = findDoctorByName(doctorName);
        if (!doctor) {
            console.error("Doctor not found!");
            return;
        }

        const allowedDays = doctor.availableDays;

        // Generate list of available dates in next 14 days
        const today = new Date();
        const availableDates = [];

        for (let i = 0; i <= 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            if (allowedDays.includes(dayName)) {
                availableDates.push(date.toISOString().split('T')[0]);
            }
        }

        // Setup flatpickr
        calendar = flatpickr(dateInput, {
            dateFormat: "Y-m-d",
            enable: availableDates,
            minDate: "today",
            maxDate: new Date().fp_incr(14)
        });
    }
    
    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
    ];
    
    // Sample appointments data
    let appointments = [
        {
            id: 'MC-2023-001',
            department: 'Cardiology',
            doctor: 'Dr. Sarah Johnson',
            date: '2023-06-15',
            time: '10:30 AM',
            patientName: 'John Doe',
            status: 'upcoming'
        },
        {
            id: 'MC-2023-002',
            department: 'Neurology',
            doctor: 'Dr. Michael Chen',
            date: '2023-05-20',
            time: '02:00 PM',
            patientName: 'John Doe',
            status: 'completed'
        },
        {
            id: 'MC-2023-003',
            department: 'General Medicine',
            doctor: 'Dr. Jennifer Lee',
            date: '2023-06-01',
            time: '11:00 AM',
            patientName: 'John Doe',
            status: 'cancelled'
        }
    ];
    
    // Initialize the page
    init();
    
    function init() {
        // Set current date as min date for appointment
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        // Load appointments
        renderAppointments();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.id.replace('-link', '-section');
                showSection(sectionId);
                
                // Update active nav link
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Auth buttons
        loginBtn.addEventListener('click', () => loginModal.classList.add('active'));
        registerBtn.addEventListener('click', () => registerModal.classList.add('active'));

        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
        
            // Always grant admin access
            if (email === 'admin123@company.com' && password === 'MediCare123') {
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin.html';
            }
            // Allow all other logins without validation
            else {
                // Grant access to regular users without checking credentials
                showSection('home-section');
                loginModal.classList.remove('active');
            }
        });
        
        // Close modals
        closeModals.forEach(btn => {
            btn.addEventListener('click', () => {
                loginModal.classList.remove('active');
                registerModal.classList.remove('active');
                confirmationModal.classList.remove('active');
            });
        });
        
        // Modal switches
        registerFromLogin.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            registerModal.classList.add('active');
        });
        
        loginFromRegister.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.classList.remove('active');
            loginModal.classList.add('active');
        });
        
        // Book appointment buttons
        heroBookBtn.addEventListener('click', () => {
            showSection('book-section');
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            document.getElementById('book-link').classList.add('active');
        });
        
        bookFromViewBtn.addEventListener('click', () => {
            showSection('book-section');
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            document.getElementById('book-link').classList.add('active');
        });
        
        // Booking form interactions
        departmentSelect.addEventListener('change', populateDoctors);
        doctorSelect.addEventListener('change', enableDateInput);
        dateInput.addEventListener('change', populateTimeSlots);
        
        // Booking form submission
        bookingForm.addEventListener('submit', handleBookingSubmit);
        
        // Form inputs for preview
        [departmentSelect, doctorSelect, dateInput, timeSelect, nameInput].forEach(input => {
            input.addEventListener('change', updatePreview);
        });
        
        // Appointments filter
        filterStatus.addEventListener('change', renderAppointments);
        refreshAppointments.addEventListener('click', renderAppointments);
        
        // Confirmation modal buttons
        printAppointmentBtn.addEventListener('click', () => window.print());
        viewAppointmentsBtn.addEventListener('click', () => {
            confirmationModal.classList.remove('active');
            showSection('view-section');
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            document.getElementById('view-link').classList.add('active');
        });
    }
    
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active-section');
        });
        document.getElementById(sectionId).classList.add('active-section');
    }
    
    function populateDoctors() {
        const department = departmentSelect.value;
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        
        if (department) {
            doctorSelect.disabled = false;
            const doctors = doctorsData[department];
            
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = doctor.name;
                doctorSelect.appendChild(option);
            });
        } else {
            doctorSelect.disabled = true;
            dateInput.disabled = true;
            timeSelect.disabled = true;
        }
        
        updatePreview();
    }
    
    function enableDateInput() {
        if (doctorSelect.value) {
            dateInput.disabled = false;
            // Update calendar with doctor's available days
            const selectedDoctor = doctorSelect.options[doctorSelect.selectedIndex].text;
            updateCalendar(selectedDoctor);
        } else {
            dateInput.disabled = true;
            timeSelect.disabled = true;
        }
        
        updatePreview();
    }
    
    function populateTimeSlots() {
        if (dateInput.value) {
            timeSelect.disabled = false;
            timeSelect.innerHTML = '<option value="">Select Time Slot</option>';
            
            // In a real app, we would check doctor's availability here
            timeSlots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot;
                option.textContent = slot;
                timeSelect.appendChild(option);
            });
        } else {
            timeSelect.disabled = true;
        }
        
        updatePreview();
    }
    
    function updatePreview() {
        document.getElementById('preview-dept').textContent = departmentSelect.options[departmentSelect.selectedIndex].text || 'Not selected';
        document.getElementById('preview-doc').textContent = doctorSelect.options[doctorSelect.selectedIndex].text || 'Not selected';
        document.getElementById('preview-date').textContent = dateInput.value ? new Date(dateInput.value).toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        }) : 'Not selected';
        document.getElementById('preview-time').textContent = timeSelect.options[timeSelect.selectedIndex].text || 'Not selected';
        document.getElementById('preview-name').textContent = nameInput.value || 'Not provided';
    }
    
    function handleBookingSubmit(e) {
        e.preventDefault();
        
        // Create new appointment
        const newAppointment = {
            id: generateAppointmentId(),
            department: departmentSelect.options[departmentSelect.selectedIndex].text,
            doctor: doctorSelect.options[doctorSelect.selectedIndex].text,
            date: dateInput.value,
            time: timeSelect.value,
            patientName: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            status: 'upcoming'
        };
        
        // Add to appointments array
        appointments.unshift(newAppointment);
        
        // Update confirmation modal
        document.getElementById('confirm-id').textContent = newAppointment.id;
        document.getElementById('confirm-doctor').textContent = newAppointment.doctor;
        document.getElementById('confirm-date').textContent = new Date(newAppointment.date).toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        document.getElementById('confirm-time').textContent = newAppointment.time;
        
        // Show confirmation modal
        confirmationModal.classList.add('active');
        
        // Reset form
        bookingForm.reset();
        doctorSelect.disabled = true;
        dateInput.disabled = true;
        timeSelect.disabled = true;
        
        // Update preview
        updatePreview();
        
        // Update appointments list
        renderAppointments();
    }
    
    function generateAppointmentId() {
        const randomNum = Math.floor(Math.random() * 900) + 100;
        return `MC-${new Date().getFullYear()}-${randomNum}`;
    }
    
    function renderAppointments() {
        const statusFilter = filterStatus.value;
        let filteredAppointments = appointments;
        
        if (statusFilter !== 'all') {
            filteredAppointments = appointments.filter(app => app.status === statusFilter);
        }
        
        if (filteredAppointments.length === 0) {
            appointmentsList.innerHTML = `
                <div class="no-appointments">
                    <i class="far fa-calendar-alt"></i>
                    <p>No ${statusFilter !== 'all' ? statusFilter : ''} appointments found.</p>
                    <button id="book-from-view">Book Appointment</button>
                </div>
            `;
            
            document.getElementById('book-from-view').addEventListener('click', () => {
                showSection('book-section');
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                document.getElementById('book-link').classList.add('active');
            });
        } else {
            appointmentsList.innerHTML = '';
            
            filteredAppointments.forEach(appointment => {
                const appointmentCard = document.createElement('div');
                appointmentCard.className = 'appointment-card';
                
                const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'short', day: 'numeric' 
                });
                
                appointmentCard.innerHTML = `
                    <div class="appointment-info">
                        <h4>${appointment.department} - ${appointment.doctor}</h4>
                        <p>${formattedDate} at ${appointment.time}</p>
                        <span class="appointment-status status-${appointment.status}">
                            ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                    </div>
                    <div class="appointment-actions">
                        ${appointment.status === 'upcoming' ? 
                            `<button class="btn btn-danger cancel-btn" data-id="${appointment.id}">Cancel</button>` : ''}
                        <button class="btn btn-outline details-btn" data-id="${appointment.id}">Details</button>
                    </div>
                `;
                
                appointmentsList.appendChild(appointmentCard);
            });
            
            // Add event listeners to action buttons
            document.querySelectorAll('.cancel-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const appointmentId = this.getAttribute('data-id');
                    cancelAppointment(appointmentId);
                });
            });
            
            document.querySelectorAll('.details-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const appointmentId = this.getAttribute('data-id');
                    showAppointmentDetails(appointmentId);
                });
            });
        }
    }
    
    function cancelAppointment(appointmentId) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            const appointmentIndex = appointments.findIndex(app => app.id === appointmentId);
            if (appointmentIndex !== -1) {
                appointments[appointmentIndex].status = 'cancelled';
                renderAppointments();
                
                // Show notification
                alert('Appointment has been cancelled.');
            }
        }
    }
    
    function showAppointmentDetails(appointmentId) {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (appointment) {
            const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            });
            
            const detailsHtml = `
                <h3>Appointment Details</h3>
                <div class="appointment-details">
                    <p><strong>Appointment ID:</strong> ${appointment.id}</p>
                    <p><strong>Department:</strong> ${appointment.department}</p>
                    <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Time:</strong> ${appointment.time}</p>
                    <p><strong>Patient Name:</strong> ${appointment.patientName}</p>
                    ${appointment.email ? `<p><strong>Email:</strong> ${appointment.email}</p>` : ''}
                    ${appointment.phone ? `<p><strong>Phone:</strong> ${appointment.phone}</p>` : ''}
                    <p><strong>Status:</strong> <span class="status-${appointment.status}">
                        ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span></p>
                </div>
            `;
            
            // Create a modal for details (or reuse an existing one)
            const detailsModal = document.createElement('div');
            detailsModal.className = 'modal active';
            detailsModal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    ${detailsHtml}
                </div>
            `;
            
            document.body.appendChild(detailsModal);
            
            // Add close event
            detailsModal.querySelector('.close-modal').addEventListener('click', () => {
                detailsModal.remove();
            });
        }
    }
});