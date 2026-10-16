const express = require("express");
const app = express();
require("dotenv").config();
const cookie = require("cookie-parser");
app.use(express.json());
app.use(cookie);

module.exports = app;
