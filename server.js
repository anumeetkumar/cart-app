const express = require("express");
const app = express();

app.post("/login", async (req, res) => {
  console.info("login");
  res.send("login");
});

app.listen(5000, () => {
  console.log(`server is running at port 5000`);
});
