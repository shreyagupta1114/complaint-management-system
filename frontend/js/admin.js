const API_URL = "http://localhost:3000/complaints";

let allComplaints = [];


// =====================================================
// Helpers for styling
// =====================================================

function statusBadgeClass(status) {
    if (status === "Pending") return "status-badge pending";
    if (status === "In Progress") return "status-badge in-progress";
    if (status === "Completed") return "status-badge completed";
    return "status-badge pending";
}

function priorityChipClass(priority) {
    if (priority === "Low") return "priority-chip low";
    if (priority === "High") return "priority-chip high";
    return "priority-chip medium";
}


// =====================================================
// 1. GET ALL COMPLAINTS
// =====================================================

async function loadAllComplaints() {
    try {
        const response = await fetch(`${API_URL}/get-all`);

        const data = await response.json();

        console.log("Admin API response:", data);

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch complaints");
        }

        allComplaints = data.complaints;

        displayComplaints(allComplaints);

    } catch (error) {
        console.error("Error:", error);

        document.getElementById("adminComplaintList").innerHTML =
            "<p>Failed to load complaints.</p>";
    }
}


// =====================================================
// 2. DISPLAY COMPLAINTS — compact summary cards
// =====================================================

function displayComplaints(complaints) {

    const container =
        document.getElementById("adminComplaintList");

    container.innerHTML = "";

    if (complaints.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">🗒</div>
                <p>No tickets match your search.</p>
            </div>
        `;
        return;
    }


    complaints.forEach((complaint) => {

        const card = document.createElement("div");

        card.className = "complaint-card summary-card";

        card.innerHTML = `

            <div class="summary-info">
                <h3>${complaint.resident_name}</h3>
                <p>Resident No: <span class="mono">${complaint.resident_id}</span> &nbsp;·&nbsp; Room ${complaint.room_no}</p>
            </div>

            <div class="summary-actions">
                <span class="${statusBadgeClass(complaint.status)}">
                    ${complaint.status}
                </span>

                <button onclick="openComplaintDetails(${complaint.id})">
                    View Details
                </button>
            </div>

        `;

        container.appendChild(card);
    });
}


// =====================================================
// 3. MODAL — full complaint details + status control
// =====================================================

const modalOverlay = document.getElementById("detailModal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

function openComplaintDetails(id) {

    const complaint = allComplaints.find((c) => c.id === id);

    if (!complaint) {
        return;
    }

    modalBody.innerHTML = `
        <span class="${statusBadgeClass(complaint.status)}" style="position:static; transform:none; display:inline-block; margin-bottom:12px;">
            ${complaint.status}
        </span>

        <h3>
            Ticket <span class="ticket-id">#${String(complaint.id).padStart(4, "0")}</span>
        </h3>

        <p class="detail-row">
            <strong>Resident:</strong>
            ${complaint.resident_name}
            <span class="mono">(ID ${complaint.resident_id})</span>
        </p>

        <p class="detail-row">
            <strong>Room:</strong>
            <span class="mono">${complaint.room_no}</span>
        </p>

        <p class="detail-row">
            <strong>Contact:</strong>
            <span class="mono">${complaint.contact}</span>
        </p>

        <p class="detail-row">
            <strong>Category:</strong>
            ${complaint.category}
        </p>

        <p class="detail-row">
            <strong>Description:</strong>
            ${complaint.description}
        </p>

        <p class="detail-row">
            <strong>Priority:</strong>
            <span class="${priorityChipClass(complaint.priority)}">${complaint.priority}</span>
        </p>

        <p class="detail-row">
            <strong>Date:</strong>
            <span class="mono">${complaint.date}</span>
        </p>

        <p class="detail-row">
            <strong>Additional Information:</strong>
            ${complaint.additional_info || "None"}
        </p>

        <div class="status-control">
            <select id="status-select-${complaint.id}">
                <option value="Pending" ${complaint.status === "Pending" ? "selected" : ""}>Pending</option>
                <option value="In Progress" ${complaint.status === "In Progress" ? "selected" : ""}>In Progress</option>
                <option value="Completed" ${complaint.status === "Completed" ? "selected" : ""}>Completed</option>
            </select>

            <button onclick="changeStatus(${complaint.id})">
                Update Status
            </button>

            <button class="danger" onclick="deleteComplaint(${complaint.id})">
                Delete Complaint
            </button>
        </div>
    `;

    modalOverlay.classList.add("open");
}

function closeModal() {
    modalOverlay.classList.remove("open");
}

modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});


// =====================================================
// CHANGE COMPLAINT STATUS
// =====================================================

async function changeStatus(id) {

    const select = document.getElementById(`status-select-${id}`);
    const status = select.value;

    try {

        const response = await fetch(
            `${API_URL}/status/${id}`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Complaint status updated successfully!");

        closeModal();

        loadAllComplaints();

    } catch (error) {

        console.error(error);

        alert("Failed to update complaint status.");
    }
}

// =====================================================
// DELETE COMPLAINT
// =====================================================

async function deleteComplaint(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this complaint? This cannot be undone."
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/delete/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Complaint deleted successfully!");

        closeModal();

        loadAllComplaints();

    } catch (error) {

        console.error(error);

        alert("Failed to delete complaint.");
    }
}

// SEARCH

document.getElementById("search").addEventListener(
    "input",
    function () {

        const searchText =
            this.value.toLowerCase();

        const filtered = allComplaints.filter(
            (complaint) => {

                return (
                    complaint.resident_name
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    complaint.room_no
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    complaint.category
                        .toLowerCase()
                        .includes(searchText)
                );
            }
        );

        displayComplaints(filtered);
    }
);

// FILTER BY STATUS

document.getElementById("statusFilter").addEventListener(
    "change",
    function () {

        const selectedStatus = this.value;

        if (selectedStatus === "all") {
            displayComplaints(allComplaints);
            return;
        }

        const filtered = allComplaints.filter(
            (complaint) =>
                complaint.status === selectedStatus
        );

        displayComplaints(filtered);
    }
);

//  LOAD WHEN PAGE OPENS
loadAllComplaints();