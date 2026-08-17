const API_BASE = "http://localhost:3000/api/complaints";

const form = document.getElementById('lookupForm');
const resultsArea = document.getElementById('resultsArea');

const statusClass = (status) => {
  if (status === 'Pending') return 'status-pending';
  if (status === 'In Progress') return 'status-progress';
  if (status === 'Completed') return 'status-completed';
  return '';
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultsArea.innerHTML = '';

  const room_no = document.getElementById('room_no').value.trim();
  const contact = document.getElementById('contact').value.trim();

  try {
    const res = await fetch(`${API_BASE}/res-complaints/${encodeURIComponent(room_no)}?contact=${encodeURIComponent(contact)}`);
    const data = await res.json();

    if (!res.ok) {
      resultsArea.innerHTML = `<p class="error-msg">${data.message}</p>`;
      return;
    }

    data.complaints.forEach((c) => {
      const card = document.createElement('div');
      card.className = 'complaint-card';
      card.innerHTML = `
        <div class="card-top">
          <h4>Complaint #${c.id} <span class="category-tag">— ${c.category}</span></h4>
          <span class="status-badge ${statusClass(c.status)}">${c.status}</span>
        </div>
        <p class="complaint-desc">${c.description}</p>
        <p class="submitted-date">Submitted: ${new Date(c.date).toLocaleDateString()}</p>
        ${c.status === 'Completed' ? renderReviewSection(c) : ''}
      `;
      resultsArea.appendChild(card);
    });
  } catch (err) {
    resultsArea.innerHTML = `<p class="error-msg">Something went wrong. Please try again.</p>`;
  }
});

function renderReviewSection(c) {
  const review = c.Review;
  if (review) {
    return `<div class="review-given"><strong>Your review:</strong> ${review.rating}★ — ${review.comment || ''}</div>`;
  }
  return `
    <div class="review-box" id="review-box-${c.id}">
      <button onclick="showReviewForm(${c.id})">Leave a Review</button>
    </div>
  `;
}

function showReviewForm(complaintId) {
  const box = document.getElementById(`review-box-${complaintId}`);
  box.innerHTML = `
    <label>Rate this resolution:</label>
    <select id="rating-${complaintId}">
      <option value="5">5 - Excellent</option>
      <option value="4">4 - Good</option>
      <option value="3">3 - Okay</option>
      <option value="2">2 - Poor</option>
      <option value="1">1 - Very Poor</option>
    </select>
    <input type="text" id="comment-${complaintId}" placeholder="Optional comment">
    <button onclick="submitReview(${complaintId})">Submit Review</button>
  `;
}

async function submitReview(complaintId) {
  const rating = document.getElementById(`rating-${complaintId}`).value;
  const comment = document.getElementById(`comment-${complaintId}`).value;

  const res = await fetch(`${API_BASE}/${complaintId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating: Number(rating), comment })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Thanks for your feedback!');
    form.dispatchEvent(new Event('submit'));
  } else {
    alert(data.message);
  }
}