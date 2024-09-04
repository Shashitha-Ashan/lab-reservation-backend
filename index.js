const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");
const dotenv = require("dotenv");
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

//Middleware Functions
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/time-slots", require("./routes/timeSlotsRoutes"));
app.use("/api/v1/modules", require("./routes/moduleRoutes"));
app.use("/api/v1/device", require("./routes/deviceIdRoutes"));
app.use("/api/v1/halls", require("./routes/hallsRoutes"));

dotenv.config();

//Connect to DB
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
