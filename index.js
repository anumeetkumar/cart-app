const express = require("express");
const app = express();

app.post("/", async (req, res) => {
  console.info("login");
  res.status(200).json({ status: true, msg: "Server running" });
});

app.post("/login", async (req, res) => {
  console.info("login");
  res.status(200).json({ status: true, msg: "Server running login" });
});

app.listen(5000, () => {
  console.log(`server is running at port 5000`);
});
