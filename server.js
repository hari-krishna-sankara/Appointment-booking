const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("colors");

// Load environment variables
dotenv.config();

// App initialization
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Import routes
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRouter");
const doctorRoutes = require("./routes/doctorRoutes"); // ✅ Add this line

// Use routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes); // ✅ Add this line

// Default route
app.get("/", (req, res) => {
  res.status(200).send({ message: "Server running" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB".bgGreen.white);
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_MODE} MODE on port ${PORT}`.bgCyan
          .white
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message.red);
  });
