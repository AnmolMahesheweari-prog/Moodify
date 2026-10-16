const express = require("express");
const app = express();
const cookie = require("cookie-parser");
app.use(express.json());
app.use(cookie);

module.exports = app;
