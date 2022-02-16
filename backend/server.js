const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
connectDB();

const PORT = process.env.PORT || 5000;

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

global.__basedir = __dirname;

/* var corsOptions = {
	origin: "http://localhost:8081",
};
app.use(cors(corsOptions)); */
const fileRoutes = require("./routes/api/file");
//app.use(express.urlencoded({ extended: true }));
fileRoutes(app);

app.get("/", (req, res) => res.send("API Running!!!!!"));

// API Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/students", require("./routes/api/students"));
app.use("/api/teachers", require("./routes/api/teachers"));
app.use("/api/offices", require("./routes/api/offices"));
app.use("/api/archive", require("./routes/api/archive"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
