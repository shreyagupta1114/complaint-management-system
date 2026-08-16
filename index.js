import express from "express";
import cors from "cors";
import sequelize from "./backend/config/db.js";
import complaintRoute from "./backend/routes/complaintRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/complaints", complaintRoute);

const PORT = 3000;

sequelize.authenticate()
    .then(() => {
        console.log("MySQL connected successfully");
    })
    .catch((error) => {
        console.log("Database connection failed:", error);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});