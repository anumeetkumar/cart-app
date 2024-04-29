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

app.post("/addProduct", async (req, res) => {
  const { name, images, availability, price, description } = req.body;
  if (!name || !images || !availability || !price || !description) {
    res.status(422).json("fill all the fields");
  }
  try {
    const newProduct = await prisma.products.create({
      data: {
        name,
        images,
        availability,
        price,
        description,
      },
    });
    console.log("newProduct", newProduct);
    res
      .status(201)
      .json({ status: true, message: "Product Created successfully" });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

app.get("/getProducts", async (req, res) => {
  try {
    const allProducts = await prisma.products.findMany();
    console.log("allProducts", allProducts);
    res.status(201).json({ status: true, data: allProducts });
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

app.post("/add-todo", async (req, res) => {
  const { user_id, title } = req.body;
  console.log("req.body", req.body);
  if (!user_id || !title) {
    return res.status(422).json("fill all the fields111");
  }
  try {
    const newTodo = await prisma.todo.create({
      data: {
        user_id,
        title,
      },
    });
    res
      .status(201)
      .json({ status: true, message: "Task created successfully" });
  } catch (err) {
    console.info("err", err);
    res.status(400).json({ status: true, message: "Something went wrnong" });
  }
});

app.get("/todo", async (req, res) => {
  const { user_id } = req.body;
  console.log("req.body", req.body);
  if (!user_id) {
    return res.status(422).json("user id is required");
  }
  try {
    const userTasks = await prisma.todo.findMany({
      where: {
        user_id: user_id,
      },
    });
    res.status(201).json({
      status: true,
      message: "Success",
      data: userTasks,
    });
  } catch (err) {
    console.info("err", err);
    res.status(400).json({ status: true, message: "Something went wrnong" });
  }
});

app.listen(5000, () => {
  console.log(`server is running at port 5000`);
});
