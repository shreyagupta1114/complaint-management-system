import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Complaint = sequelize.define("Complaint", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    resident_name: { type: DataTypes.STRING, allowNull: false },
    room_no: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    priority: { type: DataTypes.STRING, defaultValue: "Medium" },
    status: { type: DataTypes.STRING, defaultValue: "Pending" },
    additional_info: { type: DataTypes.TEXT }
}, {
    timestamps: false
});

export default Complaint;