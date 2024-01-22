const express = require("express");
const { prisma } = require("./db");
const app = express();
const cors = require("cors");
app.use(express.json());
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors());

app.get("/", async (req, res) => {
  console.info("login");
  res.status(200).json({ status: true, msg: "Server running" });
});

app.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await prisma.users.findFirst({
      where: { email: email },
    });
    if (user && user.password === password) {
      res.status(201).json({
        status: true,
        message: "loginsuccessfully",
        data: { name: user.name, id: user.user_id, email: user.email },
      });
    } else {
      res.status(400).json({ message: "wrong creds" });
    }
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
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
      res
        .status(201)
        .json({ status: true, message: "User Created successfully" });
    }
  } catch (err) {
    console.info("err", err);
  }
});

app.listen(5000, () => {
  console.log(`server is running at port 5000`);
});
