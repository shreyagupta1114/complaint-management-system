import {
    createComplaint,
    getAllComplaints as fetchAllComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    updateComplaintStatus,
    getComplaintsByRoom
} from "../functions/complaintFunction.js";


// =====================================================
// RESIDENT - CREATE COMPLAINT
// =====================================================

export const addComplaint = async (req, res) => {

    try {

        const complaint = await createComplaint(req.body);

        res.status(201).json({
            message: "Complaint submitted successfully",
            complaint
        });

    } catch (error) {

        console.error("Create complaint error:", error);

        res.status(500).json({
            message: "Failed to submit complaint",
            error: error.message
        });
    }
};


// =====================================================
// RESIDENT - GET COMPLAINTS BY ROOM
// =====================================================

export const getResComplaints = async (req, res) => {

    try {

        const complaints = await getComplaintsByRoom(
            req.params.room_no
        );

        res.status(200).json({
            message: "Complaints fetched successfully",
            complaints
        });

    } catch (error) {

        console.error("Get complaints error:", error);

        res.status(500).json({
            message: "Failed to fetch complaints",
            error: error.message
        });
    }
};


// =====================================================
// ADMIN - GET ALL COMPLAINTS
// =====================================================

export const getAllComplaints = async (req, res) => {

    try {

        const complaints = await fetchAllComplaints();

        res.status(200).json({
            message: "All complaints fetched successfully",
            complaints
        });

    } catch (error) {

        console.error("Get all complaints error:", error);

        res.status(500).json({
            message: "Failed to fetch complaints",
            error: error.message
        });
    }
};


// =====================================================
// GET ONE COMPLAINT
// =====================================================

export const getComplaint = async (req, res) => {

    try {

        const complaint = await getComplaintById(
            req.params.id
        );

        if (!complaint) {

            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            complaint
        });

    } catch (error) {

        console.error("Get complaint error:", error);

        res.status(500).json({
            message: "Failed to fetch complaint",
            error: error.message
        });
    }
};


// =====================================================
// RESIDENT - UPDATE COMPLAINT
// =====================================================

export const editComplaint = async (req, res) => {

    try {

        const complaint = await updateComplaint(
            req.params.id,
            req.body
        );

        if (!complaint) {

            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint updated successfully",
            complaint
        });

    } catch (error) {

        console.error("Update complaint error:", error);

        res.status(500).json({
            message: "Failed to update complaint",
            error: error.message
        });
    }
};


// =====================================================
// RESIDENT - DELETE COMPLAINT
// =====================================================

export const removeComplaint = async (req, res) => {

    try {

        const deleted = await deleteComplaint(
            req.params.id
        );

        if (!deleted) {

            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint deleted successfully"
        });

    } catch (error) {

        console.error("Delete complaint error:", error);

        res.status(500).json({
            message: "Failed to delete complaint",
            error: error.message
        });
    }
};


// =====================================================
// ADMIN - UPDATE STATUS
// =====================================================

export const changeComplaintStatus = async (req, res) => {

    try {

        const complaint = await updateComplaintStatus(
            req.params.id,
            req.body.status
        );

        if (!complaint) {

            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint status updated successfully",
            complaint
        });

    } catch (error) {

        console.error("Update status error:", error);

        res.status(500).json({
            message: "Failed to update complaint status",
            error: error.message
        });
    }
};