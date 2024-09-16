const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = require("./middlewares/verifyToken");
// const { initializeApp } = require("firebase-admin/app");

// initializeApp({
//   credential: admin.credential.cert({
//     type: process.env.FIREBASE_TYPE,
//     project_id: process.env.FIREBASE_PROJECT_ID,
//     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//     private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//     client_id: process.env.FIREBASE_CLIENT_ID,
//     auth_uri: process.env.FIREBASE_AUTH_URI,
//     token_uri: process.env.FIREBASE_TOKEN_URI,
//     auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//     client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
//   }),
// });

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

// test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
