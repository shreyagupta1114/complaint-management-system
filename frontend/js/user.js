const API_URL = "http://localhost:3000/api/complaints";


// =====================================================
// SUBMIT COMPLAINT
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
            throw new Error(data.error || data.message || "Something went wrong");
        }

        const messageEl = document.getElementById("message");
        messageEl.textContent = "Complaint submitted successfully!";
        messageEl.className = "success";

        form.reset();

    } catch (error) {
        console.error(error);

        const messageEl = document.getElementById("message");
        messageEl.textContent = "Failed to submit complaint: " + error.message;
        messageEl.className = "error";
    }
});