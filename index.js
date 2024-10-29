const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = require("./middlewares/verifyToken");

const app = express();
// app.set("trust proxy", true);

// app.use((req, res, next) => {
//   if (req.secure) {
//     next();
//   } else {
//     res.redirect(`https://${req.headers.host}${req.url}`);
//   }
// });
//Middleware Functions
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

//Connect to DB
connectDB();
//Routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/time-slots", verifyToken, require("./routes/timeSlotsRoutes"));
app.use("/api/v1/modules", verifyToken, require("./routes/moduleRoutes"));
app.use("/api/v1/device", verifyToken, require("./routes/deviceIdRoutes"));
app.use("/api/v1/halls", verifyToken, require("./routes/hallsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use(
  "/api/v1/academic-year",
  verifyToken,
  require("./routes/academicYearRoutes")
);
app.use(
  "/api/v1/department",
  verifyToken,
  require("./routes/departmentRoutes")
);
app.use("/api/v1/focus-area", verifyToken, require("./routes/focusAreaRoutes"));
app.use(
  "/api/v1/notification",
  verifyToken,
  require("./routes/notificationsRoutes")
);
app.use("/api/v1/summary", verifyToken, require("./routes/summaryRoutes"));
app.use(
  "/api/v1/system-status",
  verifyToken,
  require("./routes/systemStatusRoute")
);
app.use(
  "/api/v1/request-notification",
  verifyToken,
  require("./routes/requestNotificationRoutes")
);

// test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server Listening on port`)
);

module.exports = app;
