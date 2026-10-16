const app = require("./src/index");
const connectToDb = require("./src/config/database");

connectToDb();
app.listen(3000, () => {
  console.log("server is running..");
});
