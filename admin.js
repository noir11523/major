document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('datePicker');

    datePicker.addEventListener('change', function () {
        const selectedDate = new Date(this.value);
        const formattedDate = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}`;
        todayValueElement.textContent = formattedDate;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'index.html'; // Make sure this file exists
        });
    }
});

    // Initialize Charts
    initAppointmentsChart();
    initSpecializationChart();
    initCalendar();

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    });

    function initAppointmentsChart() {
        const ctx = document.getElementById('appointmentsChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'Completed Appointments',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Cancelled Appointments',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'New Appointments',
                        data: [18, 38, 50, 29, 76, 37, 60],
                        borderColor: '#10b981', // Changed to a distinct green
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Monthly Appointments' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    function initSpecializationChart() {
        const ctx = document.getElementById('specializationChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Cardiology', 'Neurology', 'General Medicine'],
                datasets: [{
                    data: [45, 35, 20],
                    backgroundColor: [
                        '#06b6d4', // Cyan
                        '#fde047', // Yellow
                        '#f472b6'  // Pink
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                }
            }
        });
    }
    
   function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    const dateAppointmentsList = document.getElementById('date-appointments-list');
    const selectedDateSpan = document.getElementById('selected-date');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [FullCalendar.dayGridPlugin, FullCalendar.interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        dateClick: function(info) {
            const clickedDate = new Date(info.dateStr);
            const formattedDate = `${clickedDate.getMonth() + 1}/${clickedDate.getDate()}`;
            
           
            // Filter and display appointments
            const filteredAppointments = window.appointments.filter(app => 
                app.date === info.dateStr
            );
            
            renderDateAppointments(filteredAppointments);
        }
    });

    calendar.render();
}

function renderDateAppointments(appointments) {
    const container = document.getElementById('date-appointments-list');
    container.innerHTML = '';

    if (appointments.length === 0) {
        container.innerHTML = `<div class="text-muted">No appointments for this date</div>`;
        return;
    }

    appointments.forEach(appointment => {
        const appointmentHTML = `
            <div class="appointment-item">
                <div>
                    <div class="font-medium">${appointment.doctor}</div>
                    <div class="appointment-time">${appointment.time}</div>
                </div>
                <span class="appointment-status status-${appointment.status}">
                    ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', appointmentHTML);
    });
}

function filterAppointments(searchTerm) {
    const appointments = getAppointments();
    const filtered = appointments.filter(app => 
        app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tbody = document.getElementById('all-appointments-body');
    tbody.innerHTML = '';
    
    filtered.forEach(appointment => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.patientName}</td>
            <td>${appointment.email}</td>
            <td>${appointment.phone}</td>
            <td>${appointment.doctor}</td>
            <td>${appointment.department}</td>
            <td>${formatDate(appointment.date)}</td>
            <td><span class="status-badge status-${appointment.status}">${capitalizeFirstLetter(appointment.status)}</span></td>
            <td class="table-actions">
                <button class="btn btn-outline view-appointment-btn" data-id="${appointment.id}">View</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Re-add event listeners
    document.querySelectorAll('.view-appointment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const appointmentId = this.getAttribute('data-id');
            showAppointmentDetails(appointmentId);
        });
    });
}
