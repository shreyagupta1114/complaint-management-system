const API_BASE = "http://localhost:3000/api/complaints";

const form = document.getElementById('lookupForm');
const resultsArea = document.getElementById('resultsArea');

const statusClass = (status) => {
  if (status === 'Pending') return 'pending';
  if (status === 'In Progress') return 'in-progress';
  if (status === 'Completed') return 'completed';
  return '';
};

const cardClass = (status) => {
  if (status === 'Pending') return 'card-pending';
  if (status === 'In Progress') return 'card-progress';
  if (status === 'Completed') return 'card-completed';
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
      card.className = `complaint-card ${cardClass(c.status)}`;
      card.innerHTML = `
        <p><strong>Complaint #${c.id}</strong> — ${c.category}</p>
        <p>${c.description}</p>
        <span class="status-badge ${statusClass(c.status)}">${c.status}</span>
        <p style="font-size:12px;color:#888;">Submitted: ${new Date(c.date).toLocaleDateString()}</p>
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
    return `<div class="review-box"><em>Your review: ${review.rating}★ — ${review.comment || ''}</em></div>`;
  }
  return `
    <div class="review-box" id="review-box-${c.id}">
      <button class="secondary" onclick="showReviewForm(${c.id})">Leave a Review</button>
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