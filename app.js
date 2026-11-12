
"use strict";

/* ======================================
   ELVARA BEAUTY - APPLICATION DATA
====================================== */

const services = [
    {
        id: 1,
        name: "Signature Knotless Braids",
        category: "Hair",
        price: 350,
        duration: 240,
        description: "Beautiful, lightweight protective styling.",
        image: "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?w=800"
    },
    {
        id: 2,
        name: "Silk Press",
        category: "Hair",
        price: 300,
        duration: 120,
        description: "A smooth, silky and beautifully finished look.",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"
    },
    {
        id: 3,
        name: "Luxury Hair Wash",
        category: "Hair",
        price: 80,
        duration: 60,
        description: "A refreshing wash and nourishing treatment.",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800"
    },
    {
        id: 4,
        name: "Classic Manicure",
        category: "Nails",
        price: 150,
        duration: 45,
        description: "Beautifully shaped and polished natural nails.",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800"
    },
    {
        id: 5,
        name: "Gel Nail Extensions",
        category: "Nails",
        price: 120,
        duration: 90,
        description: "Elegant, durable and beautifully designed nails.",
        image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800"
    },
    {
        id: 6,
        name: "Classic Lash Extensions",
        category: "Lashes",
        price: 150,
        duration: 90,
        description: "A soft, natural enhancement for your eyes.",
        image: "https://images.unsplash.com/photo-1583001809873-a128495da465?w=800"
    },
    {
        id: 7,
        name: "Hybrid Lash Extensions",
        category: "Lashes",
        price: 200,
        duration: 120,
        description: "A fuller, dimensional lash experience.",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800"
    },
    {
        id: 8,
        name: "Luxury Facial",
        category: "Beauty",
        price: 350,
        duration: 75,
        description: "A relaxing facial treatment and skin refresh.",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800"
    },
    {
        id: 9,
        name: "Brow Shaping",
        category: "Beauty",
        price: 150,
        duration: 30,
        description: "Expert brow shaping and definition.",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800"
    }
];

const staff = [
    {
        id: 1,
        name: "Nokwanda",
        role: "Senior Hair Stylist",
        category: "Hair",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600"
    },
    {
        id: 2,
        name: "Zothile",
        role: "Nail Technician",
        category: "Nails",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"
    },
    {
        id: 3,
        name: "Kwandile",
        role: "Lash Artist",
        category: "Lashes",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600"
    },
    {
        id: 4,
        name: "Sanele",
        role: "Beauty Therapist",
        category: "Beauty",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600"
    },
    {
        id: 5,
        name: "Buhle",
        role: "Senior Beauty Specialist",
        category: "All",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600"
    }
];

/* ======================================
   APPLICATION STORAGE
====================================== */

const STORAGE_KEY = "elvara_beauty_bookings_v1";

function getBookings() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.error("Unable to read bookings:", error);
        return [];
    }
}

function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function formatPrice(price) {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0
    }).format(price);
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours && remaining) return `${hours}h ${remaining}m`;
    if (hours) return `${hours} hours`;
    return `${minutes} minutes`;
}

function generateReference() {
    return "ELV-" + Date.now().toString(36).toUpperCase() +
        "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
}

/* ======================================
   PAGE NAVIGATION
====================================== */

function showPage(page) {
    const pages = ["home", "booking", "mybookings", "admin"];

    pages.forEach(name => {
        const element = document.getElementById(name + "Page");
        element.classList.toggle("active", name === page);
    });

    document.getElementById("navigation").classList.remove("open");

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (page === "admin") renderAdmin();
      if (document.getElementById("serviceSelect").options.length <= 1) {
        populateServiceSelect();
    }

    if (document.getElementById("staffSelect").options.length <= 1) {
        populateStaffSelect();
    }

    updateBookingSummary();
}


function notify(message) {
    const notification = document.getElementById("notification");

    notification.textContent = message;
    notification.classList.add("show");

    clearTimeout(notify.timer);

    notify.timer = setTimeout(() => {
        notification.classList.remove("show");
    }, 3500);
}

/* ======================================
   HOMEPAGE SERVICES
====================================== */

function renderServices(category = "All") {
    const grid = document.getElementById("serviceGrid");

    const filtered = category === "All"
        ? services
        : services.filter(service => service.category === category);

    grid.innerHTML = filtered.map(service => `
        <article class="service-card">
            <img src="${service.image}"
                 alt="${escapeHTML(service.name)}"
                 loading="lazy"
                 onerror="this.style.display='none'">

            <div class="service-card-content">
                <span class="service-category">
                    ${escapeHTML(service.category.toUpperCase())}
                </span>

                <h3>${escapeHTML(service.name)}</h3>

                <p class="service-description">
                    ${escapeHTML(service.description)}
                </p>

                <div class="service-bottom">
                    <div>
                        <div class="service-price">
                            ${formatPrice(service.price)}
                        </div>
                        <div class="service-duration">
                            ${formatDuration(service.duration)}
                        </div>
                    </div>

                    <button class="service-book"
                        onclick="selectService(${service.id})">
                        BOOK NOW →
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

function selectService(serviceId) {
    populateServiceSelect();
    document.getElementById("serviceSelect").value = serviceId;

    updateBookingSummary();
    updateStaffOptions();

    showPage("booking");
}

/* ======================================
   TEAM
====================================== */

function renderTeam() {
    document.getElementById("teamGrid").innerHTML = staff
        .map(member => `
            <article class="team-card">
                <img src="${member.image}"
                     alt="${escapeHTML(member.name)}"
                     loading="lazy"
                     onerror="this.style.display='none'">

                <h3>${escapeHTML(member.name)}</h3>
                <p>${escapeHTML(member.role)}</p>
            </article>
        `).join("");
}

/* ======================================
   BOOKING FORM
====================================== */

function populateServiceSelect() {
    const select = document.getElementById("serviceSelect");

    select.innerHTML = `
        <option value="">Choose a service</option>
        ${services.map(service => `
            <option value="${service.id}">
                ${escapeHTML(service.name)} - ${formatPrice(service.price)}
            </option>
        `).join("")}
    `;
}

function populateStaffSelect() {
    const select = document.getElementById("staffSelect");

    select.innerHTML = `
        <option value="">Choose a specialist</option>
        ${staff.map(member => `
            <option value="${member.id}">
                ${escapeHTML(member.name)} - ${escapeHTML(member.role)}
            </option>
        `).join("")}
    `;
}

function updateStaffOptions() {
    const serviceId = Number(
        document.getElementById("serviceSelect").value
    );

    const service = services.find(item => item.id === serviceId);
    const select = document.getElementById("staffSelect");

    const availableStaff = service
        ? staff.filter(member =>
            member.category === service.category ||
            member.category === "All"
        )
        : staff;

    select.innerHTML = `
        <option value="">Choose a specialist</option>
        ${availableStaff.map(member => `
            <option value="${member.id}">
                ${escapeHTML(member.name)} - ${escapeHTML(member.role)}
            </option>
        `).join("")}
    `;

    updateBookingSummary();
}

function updateBookingSummary() {
    const serviceId = Number(
        document.getElementById("serviceSelect").value
    );

    const service = services.find(item => item.id === serviceId);
    const staffId = Number(
        document.getElementById("staffSelect").value
    );

    const member = staff.find(item => item.id === staffId);

    const summary = document.getElementById("bookingSummary");

    if (!service) {
        summary.innerHTML = `
            <h3>Your booking summary</h3>
            <p>Select a service to see your booking details.</p>
        `;

        document.getElementById("serviceInformation").textContent =
            "Your service duration and price will appear here.";

        return;
    }

    document.getElementById("serviceInformation").textContent =
        `${formatDuration(service.duration)} · ${formatPrice(service.price)}`;

    summary.innerHTML = `
        <h3>Your booking summary</h3>
        <p><strong>Service:</strong> ${escapeHTML(service.name)}</p>
        <p><strong>Specialist:</strong> ${member ? escapeHTML(member.name) : "Not selected"}</p>
        <p><strong>Duration:</strong> ${formatDuration(service.duration)}</p>
        <p><strong>Price:</strong> ${formatPrice(service.price)}</p>
    `;
}

function getAvailableTimes(date, memberId, serviceId) {
    const service = services.find(item => item.id === Number(serviceId));
    const member = staff.find(item => item.id === Number(memberId));

    if (!service || !member || !date) return [];

    const allTimes = [
        "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00"
    ];

    return allTimes.filter(time => {
        const start = new Date(`${date}T${time}:00`);
        const end = new Date(start.getTime() + service.duration * 60000);

        if (end.getHours() > 17 ||
            (end.getHours() === 17 && end.getMinutes() > 0)) {
            return false;
        }

        const now = new Date();

        if (date === getLocalDate() && start <= now) {
            return false;
        }

        return !getBookings().some(booking => {
            if (
                booking.staffId !== member.id ||
                booking.date !== date ||
                ["Cancelled", "Completed"].includes(booking.status)
            ) return false;

            const existingService = services.find(
                item => item.id === booking.serviceId
            );

            if (!existingService) return false;

            const existingStart = new Date(`${booking.date}T${booking.time}:00`);
            const existingEnd = new Date(
                existingStart.getTime() + existingService.duration * 60000
            );

            return start < existingEnd && end > existingStart;
        });
    });
}

function refreshAvailableTimes() {
    const date = document.getElementById("bookingDate").value;
    const memberId = document.getElementById("staffSelect").value;
    const serviceId = document.getElementById("serviceSelect").value;

    const timeSelect = document.getElementById("bookingTime");
    const selectedTime = timeSelect.value;

    const times = getAvailableTimes(date, memberId, serviceId);

    timeSelect.innerHTML = `
        <option value="">Choose a time</option>
        ${times.map(time => `
            <option value="${time}">${time}</option>
        `).join("")}
    `;

    if (times.includes(selectedTime)) {
        timeSelect.value = selectedTime;
    }

    if (date && memberId && serviceId && times.length === 0) {
        notify("No available appointments for this selection.");
    }
}

function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function submitBooking(event) {
    event.preventDefault();

    const name = document.getElementById("clientName").value.trim();
    const email = document.getElementById("clientEmail").value.trim().toLowerCase();
    const phone = document.getElementById("clientPhone").value.trim();
    const serviceId = Number(document.getElementById("serviceSelect").value);
    const staffId = Number(document.getElementById("staffSelect").value);
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;
    const notes = document.getElementById("bookingNotes").value.trim();

    const service = services.find(item => item.id === serviceId);
    const member = staff.find(item => item.id === staffId);

    if (!service || !member || !name || !email || !phone || !date || !time) {
        notify("Please complete all required booking details.");
        return;
    }

    if (date < getLocalDate()) {
        notify("Please choose a future appointment date.");
        return;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        notify("Please enter a valid phone number.");
        return;
    }

    if (!getAvailableTimes(date, staffId, serviceId).includes(time)) {
        notify("That time is no longer available. Please choose another.");
        refreshAvailableTimes();
        return;
    }

    const booking = {
        reference: generateReference(),
        clientName: name,
        email,
        phone,
        serviceId,
        serviceName: service.name,
        staffId: member.id,
        staffName: member.name,
        date,
        time,
        price: service.price,
        duration: service.duration,
        notes,
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    const bookings = getBookings();
    bookings.push(booking);
    saveBookings(bookings);

    document.getElementById("bookingForm").reset();
    document.getElementById("bookingTime").innerHTML =
        '<option value="">Choose a time</option>';

    updateBookingSummary();

    notify("Your appointment request has been saved!");

    showPage("mybookings");

    document.getElementById("lookupEmail").value = email;
    renderMyBookings(email);

    alert(
        "ELVARA BEAUTY\n\n" +
        "Booking request received!\n\n" +
        "Reference: " + booking.reference + "\n" +
        "Service: " + booking.serviceName + "\n" +
        "Date: " + booking.date + "\n" +
        "Time: " + booking.time + "\n\n" +
        "Status: Pending"
    );
}

/* ======================================
   CUSTOMER BOOKING LOOKUP
====================================== */

function renderMyBookings(email) {
    const results = document.getElementById("myBookingResults");

    const bookings = getBookings().filter(
        booking => booking.email === email.toLowerCase().trim()
    );

    if (bookings.length === 0) {
        results.innerHTML = "<p>No appointments found for this email.</p>";
        return;
    }

    results.innerHTML = bookings.map(booking => `
        <article class="booking-result-card">
            <h3>${escapeHTML(booking.serviceName)}</h3>
            <p>Reference: ${escapeHTML(booking.reference)}</p>
            <p>Date: ${escapeHTML(booking.date)} at ${escapeHTML(booking.time)}</p>
            <p>Specialist: ${escapeHTML(booking.staffName)}</p>
            <p>Price: ${formatPrice(booking.price)}</p>
            <p>Status:
                <span class="status ${booking.status.toLowerCase()}">
                    ${escapeHTML(booking.status)}
                </span>
            </p>

            ${booking.status === "Pending" ||
              booking.status === "Confirmed" ? `
                <button class="cancel-btn"
                    onclick="cancelBooking('${escapeHTML(booking.reference)}', '${escapeHTML(booking.email)}')">
                    Cancel appointment
                </button>
            ` : ""}
        </article>
    `).join("");
}

function cancelBooking(reference, email) {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
        return;
    }

    const bookings = getBookings();

    const booking = bookings.find(item =>
        item.reference === reference &&
        item.email === email
    );

    if (!booking) return;

    booking.status = "Cancelled";
    saveBookings(bookings);

    renderMyBookings(email);
    notify("Your appointment has been cancelled.");
}

/* ======================================
   ADMIN DASHBOARD
====================================== */

function renderAdmin() {
    const bookings = getBookings();

    const pending = bookings.filter(b => b.status === "Pending");
    const confirmed = bookings.filter(b => b.status === "Confirmed");

    const revenue = bookings
        .filter(b => ["Confirmed", "Completed"].includes(b.status))
        .reduce((total, booking) => total + Number(booking.price), 0);

    document.getElementById("totalBookings").textContent = bookings.length;
    document.getElementById("pendingBookings").textContent = pending.length;
    document.getElementById("confirmedBookings").textContent = confirmed.length;
    document.getElementById("estimatedRevenue").textContent = formatPrice(revenue);

    const table = document.getElementById("adminBookings");

    if (bookings.length === 0) {
        table.innerHTML = `
            <tr><td colspan="8">No appointments have been registered yet.</td></tr>
        `;
        return;
    }

    table.innerHTML = [...bookings].reverse().map(booking => `
        <tr>
            <td>${escapeHTML(booking.reference)}</td>
            <td>${escapeHTML(booking.clientName)}</td>
            <td>${escapeHTML(booking.serviceName)}</td>
            <td>${escapeHTML(booking.staffName)}</td>
            <td>${escapeHTML(booking.date)} ${escapeHTML(booking.time)}</td>
            <td>${formatPrice(booking.price)}</td>
            <td>
                <span class="status ${booking.status.toLowerCase()}">
                    ${escapeHTML(booking.status)}
                </span>
            </td>
            <td>
                ${booking.status === "Pending" ? `
                    <button class="status-action"
                        onclick="changeStatus('${escapeHTML(booking.reference)}','Confirmed')">
                        Confirm
                    </button>
                ` : ""}

                ${booking.status === "Confirmed" ? `
                    <button class="status-action"
                        onclick="changeStatus('${escapeHTML(booking.reference)}','Completed')">
                        Complete
                    </button>
                ` : ""}

                ${["Pending", "Confirmed"].includes(booking.status) ? `
                    <button class="status-action"
                        onclick="changeStatus('${escapeHTML(booking.reference)}','Cancelled')">
                        Cancel
                    </button>
                ` : ""}
            </td>
        </tr>
    `).join("");
}

function changeStatus(reference, newStatus) {
    const bookings = getBookings();

    const booking = bookings.find(item => item.reference === reference);

    if (!booking) return;

    booking.status = newStatus;

    saveBookings(bookings);
    renderAdmin();

    notify(`Appointment marked as ${newStatus}.`);
}

/* ======================================
   CSV EXPORT
====================================== */

function exportBookings() {
    const bookings = getBookings();

    if (bookings.length === 0) {
        notify("There are no bookings to export.");
        return;
    }

    const columns = [
        "Reference", "Client", "Email", "Phone",
        "Service", "Specialist", "Date", "Time",
        "Price", "Status", "Notes"
    ];

    const rows = bookings.map(b => [
        b.reference, b.clientName, b.email, b.phone,
        b.serviceName, b.staffName, b.date, b.time,
        b.price, b.status, b.notes
    ]);

    const csv = [columns, ...rows]
        .map(row => row.map(value =>
            '"' + String(value ?? "").replace(/"/g, '""') + '"'
        ).join(","))
        .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "elvara-beauty-bookings.csv";
    link.click();

    URL.revokeObjectURL(url);

    notify("Your bookings have been exported.");
}

/* ======================================
   DEMO DATA RESET
====================================== */

function resetDemoData() {
    if (!confirm("This will permanently clear all demo bookings in this browser. Continue?")) {
        return;
    }

    localStorage.removeItem(STORAGE_KEY);

    renderAdmin();
    notify("Demo booking data has been reset.");
}

/* ======================================
   APPLICATION INITIALIZATION
====================================== */

document.addEventListener("DOMContentLoaded", () => {

    renderServices();
    renderTeam();

    document.getElementById("year").textContent =
        new Date().getFullYear();

    document.getElementById("bookingDate").min =
        getLocalDate();

    document.getElementById("menuToggle").addEventListener("click", () => {
        document.getElementById("navigation").classList.toggle("open");
    });

    document.getElementById("categoryFilters").addEventListener("click", event => {
        const button = event.target.closest("[data-category]");

        if (!button) return;

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        renderServices(button.dataset.category);
    });

    document.getElementById("serviceSelect").addEventListener("change", () => {
        updateStaffOptions();
        refreshAvailableTimes();
    });

    document.getElementById("staffSelect").addEventListener("change", () => {
        updateBookingSummary();
        refreshAvailableTimes();
    });

    document.getElementById("bookingDate").addEventListener("change", () => {
        refreshAvailableTimes();
    });

    document.getElementById("bookingForm").addEventListener(
        "submit", submitBooking
    );

    document.getElementById("lookupForm").addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("lookupEmail").value;
        renderMyBookings(email);
    });

    showPage("home");
});
