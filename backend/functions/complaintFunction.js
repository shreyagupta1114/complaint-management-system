import Complaint from "../models/complaintModel.js";
import Review from "../models/reviewModel.js";


// CREATE complaint
export const createComplaint = async (complaintData) => {
    return await Complaint.create(complaintData);
};


// GET all complaints
export const getAllComplaints = async () => {
    return await Complaint.findAll();
};

// GET complaint by ID
export const getComplaintById = async (id) => {
    return await Complaint.findByPk(id);
};

// GET complaints of a particular room + contact (used for View Status lookup)
export const getComplaintsByRoom = async (room_no, contact) => {
    return await Complaint.findAll({
        where: {
            room_no: room_no,
            contact: contact
        },
        include: [
            {
                model: Review,
                required: false
            }
        ],
        order: [["date", "DESC"]]
    });
};


// UPDATE complaint
export const updateComplaint = async (id, complaintData) => {
    const complaint = await Complaint.findByPk(id);

    if (!complaint) {
        return null;
    }
    await complaint.update(complaintData);
    return complaint;
};


// DELETE complaint
export const deleteComplaint = async (id) => {
    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
        return null;
    }
    await complaint.destroy();

    return true;
};


// UPDATE complaint status
export const updateComplaintStatus = async (id, status) => {
    const complaint = await Complaint.findByPk(id);
    if (!complaint) {
        return null;
    }
    await complaint.update({
        status: status
    });

    return complaint;
};


// ADD review for a resolved complaint
export const addComplaintReview = async (complaint_id, rating, comment) => {
    return await Review.create({
        complaint_id: complaint_id,
        rating: rating,
        comment: comment || null
    });
};