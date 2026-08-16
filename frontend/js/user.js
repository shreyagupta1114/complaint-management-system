const API_URL = "http://localhost:3000/complaints";

// Temporary resident ID for testing
const residentId = 101;


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
// 1. SUBMIT COMPLAINT
// =====================================================

const form = document.getElementById("complaintForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const complaint = {
        resident_name: document.getElementById("resident_name").value,
        room_no: document.getElementById("room_no").value,
        contact: document.getElementById("contact").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        priority: document.getElementById("priority").value,
        additional_info: document.getElementById("additional_info").value
    };

    try {
        const response = await fetch(`${API_URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(complaint)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message);
        }

        document.getElementById("message").textContent =
            "Complaint submitted successfully!";

        form.reset();

        // Reload complaints after submitting
        loadComplaints();

    } catch (error) {
        console.error(error);

        document.getElementById("message").textContent =
            "Failed to submit complaint: " + error.message;
    }
});


// =====================================================
// 2. GET RESIDENT'S COMPLAINTS
// =====================================================
async function loadComplaints() {
    try {
        const response = await fetch(`${API_URL}/get-all`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        displayComplaints(data.complaints);

    } catch (error) {
        console.error(error);

        document.getElementById("complaintList").innerHTML =
            "<p>Failed to load complaints.</p>";
    }
}
// =====================================================
// 3. DISPLAY COMPLAINTS
// =====================================================

function displayComplaints(complaints) {

    const complaintList =
        document.getElementById("complaintList");

    complaintList.innerHTML = "";

    if (complaints.length === 0) {

        complaintList.innerHTML = `
            <div class="empty-state">
                <div class="icon">🗒</div>
                <p>You haven't filed any tickets yet.</p>
            </div>
        `;

        return;
    }


    complaints.forEach((complaint) => {

        const card = document.createElement("div");

        card.className = "complaint-card";

        card.innerHTML = `
            <span class="${statusBadgeClass(complaint.status)}">
                ${complaint.status}
            </span>

            <h3>${complaint.category}</h3>

            <p>
                <strong>Ticket:</strong>
                <span class="ticket-id">#${String(complaint.id).padStart(4, "0")}</span>
            </p>

            <p>
                <strong>Room:</strong>
                <span class="mono">${complaint.room_no}</span>
            </p>

            <p>
                <strong>Description:</strong>
                ${complaint.description}
            </p>

            <p>
                <strong>Priority:</strong>
                <span class="${priorityChipClass(complaint.priority)}">${complaint.priority}</span>
            </p>

            <p>
                <strong>Date:</strong>
                <span class="mono">${complaint.date}</span>
            </p>

            <button onclick="viewComplaint(${complaint.id})">
                View
            </button>

            <button class="secondary" onclick="editComplaint(${complaint.id})">
                Edit
            </button>

            <button class="danger" onclick="deleteComplaint(${complaint.id})">
                Delete
            </button>
        `;

        complaintList.appendChild(card);
    });
}


// =====================================================
// 4. VIEW ONE COMPLAINT
// =====================================================

async function viewComplaint(id) {

    try {

        const response = await fetch(
            `${API_URL}/get/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        const complaint = data.complaint;

        alert(`
Complaint ID: ${complaint.id}

Resident: ${complaint.resident_name}

Room: ${complaint.room_no}

Category: ${complaint.category}

Description: ${complaint.description}

Priority: ${complaint.priority}

Status: ${complaint.status}

Additional Info: ${complaint.additional_info || "None"}

Date: ${complaint.date}
        `);

    } catch (error) {

        console.error(error);

        alert("Failed to fetch complaint.");
    }
}


// =====================================================
// 5. EDIT COMPLAINT
// =====================================================

async function editComplaint(id) {

    const newDescription = prompt(
        "Enter new description:"
    );

    if (!newDescription) {
        return;
    }

    const newPriority = prompt(
        "Enter priority (Low / Medium / High):"
    );

    if (!newPriority) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/update/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    description: newDescription,
                    priority: newPriority
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Complaint updated successfully!");

        loadComplaints();

    } catch (error) {

        console.error(error);

        alert("Failed to update complaint.");
    }
}


// =====================================================
// 6. DELETE / CANCEL COMPLAINT
// =====================================================

async function deleteComplaint(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this complaint?"
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

        loadComplaints();

    } catch (error) {

        console.error(error);

        alert("Failed to delete complaint.");
    }
}


// =====================================================
// 7. LOAD COMPLAINTS WHEN PAGE OPENS
// =====================================================

loadComplaints();