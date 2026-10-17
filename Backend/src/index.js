const express = require("express");
const app = express();
require("dotenv").config();
const cookie = require("cookie-parser");
const route = require("./Routes/auth.route");

app.use(express.json());
app.use(cookie);
app.use("/api/auth", route);

module.exports = app;
