import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Complaint from "./complaintModel.js";

const Review = sequelize.define("Review", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    complaint_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: false
});

// Associations
Complaint.hasOne(Review, { foreignKey: "complaint_id" });
Review.belongsTo(Complaint, { foreignKey: "complaint_id" });

export default Review;