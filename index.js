const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(express.json()); // for json.body
app.use(cors());

// set up auth router
app.use("/auth", require("./routes/jwtAuth"));

// set up task router
app.use("/task", require("./routes/tasks"));

// routes
app.listen(3001, () => {
  console.log("App is running on 3001");
});
