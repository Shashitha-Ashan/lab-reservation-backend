const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");
const dotenv = require("dotenv");

const app = express();

//Middleware Functions
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/time-slots", require("./routes/timeSlotsRoutes"));

dotenv.config();

//Connect to DB
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
