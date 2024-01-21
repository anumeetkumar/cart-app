const express = require("express");
const app = express();
const { prisma } = require("./db");

app.get("/", async (req, res) => {
  console.info("login");
  res.status(200).json({ status: true, msg: "Server running" });
});

app.post("/login", async (req, res) => {
  const user = await prisma.users.findFirst({
    where: { email: req.body.email },
  });
  console.info("login");
  res.status(200).json({ status: true, msg: "Server running login" });
});

app.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !work || !password) {
    res.status(422).json("fill all the fields");
  }
  try {
    const user = await prisma.users.findFirst({
      where: { email: email },
    });
    if (user) {
      res.status(400).json({ status: true, message: "Already register" });
    } else {
      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          phone,
          password,
        },
      });
    }
  } catch (err) {}
});

app.listen(5000, () => {
  console.log(`server is running at port 5000`);
});
