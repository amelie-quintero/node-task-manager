const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/AuthRoutes");
const profileRoutes = require("./routes/ProfileRoutes");
const taskRoutes = require("./routes/TaskRoutes");

app.use(express.json());
app.use(cors());

const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, (err) => {
    if (err) throw err;
    console.log("Mongodb connected.");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tasks", taskRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Backend is running on port: " + port);
})