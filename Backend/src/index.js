const express = require("express");
const app = express();
require("dotenv").config();
const authRoute = require("./Routes/auth.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  }),
);
app.use("/api/user", authRoute);
app.use(cookieParser());

module.exports = app;
