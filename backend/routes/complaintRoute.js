import express from "express";

import {
    addComplaint,
    getResComplaints,
    getAllComplaints,
    getComplaint,
    editComplaint,
    removeComplaint,
    changeComplaintStatus,
    addReview
} from "../controller/complaintController.js";

const router = express.Router();


// Resident
router.post("/create", addComplaint);
router.get("/res-complaints/:room_no", getResComplaints);   // ?contact=... query param required
router.put("/update/:id", editComplaint);
router.delete("/delete/:id", removeComplaint);
router.post("/:id/review", addReview);


// Admin
router.get("/get-all", getAllComplaints);
router.patch("/status/:id", changeComplaintStatus);


// Resident/Admin
router.get("/get/:id", getComplaint);


export default router;