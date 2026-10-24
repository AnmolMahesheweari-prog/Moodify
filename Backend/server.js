const app = require("./src/index");
const connectToDb = require("./src/Config/database");

connectToDb();
app.listen(3000, () => {
  console.log("server is runingg...");
});
