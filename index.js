const express = require("express");
const { prisma } = require("./db");
const app = express();
const cors = require("cors");
const multiparty = require("multiparty");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
app.use(express.json());
const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

app.get("/", async (req, res) => {
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

app.post("/todo", async (req, res) => {
  const { user_id } = req.body;
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

app.post("/add-blog", async (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Error parsing form data" });
      return;
    }
    try {
      if (
        !files.file ||
        !Array.isArray(files.file) ||
        files.file.length === 0
      ) {
        throw new Error("No file uploaded");
      }

      const fileName = new Date().getTime();
      // Get the uploaded file object
      const uploadedFile = files.file[0];
      const formData = new FormData();
      const readstream = await fs.createReadStream(uploadedFile.path);
      formData.append("file", readstream);
      const response = await axios.post(
        `https://stg-apis.keylr.com/api/v1/upload_file_s3`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newBlog = await prisma.blog.create({
        data: {
          user_id: Number(fields.user_id[0]),
          title: fields.title[0],
          summary: fields.summary[0],
          categories: JSON.parse(fields.categories[0]),
          created_on: fields.created_on[0],
          image: response.data.data,
        },
      });
      res
        .status(201)
        .json({ status: true, message: "Blog created successfully" });
    } catch (err) {
      console.log("err", err);
      res.status(400).json({ status: true, message: "Something went wrnong" });
    }
  });
});

app.get("/blogs", async (req, res) => {
  const { user_id } = req.body;
  const { id } = req.query;

  try {
    if (id) {
      const blog = await prisma.blog.findMany({
        where: {
          blog_id: Number(id),
        },
      });
      return res.status(201).json({
        status: true,
        message: "Success ",
        data: blog,
      });
    } else {
      const userTasks = await prisma.blog.findMany({
        where: {
          user_id: user_id,
        },
      });
      res.status(201).json({
        status: true,
        message: "Success",
        data: userTasks,
      });
    }
  } catch (err) {
    console.info("err", err);
    res.status(400).json({ status: true, message: "Something went wrnong" });
  }
});

app.post("/blogs", async (req, res) => {
  const { user_id } = req.body;
  const { id } = req.query;
  try {
    if (id) {
      const blog = await prisma.blog.findMany({
        where: {
          blog_id: Number(id),
        },
      });
      return res.status(201).json({
        status: true,
        message: "Success ",
        data: blog,
      });
    }
    if (!user_id) {
      const userTasks = await prisma.blog.findMany({
        where: {
          user_id: user_id,
        },
      });
      return res.status(201).json({
        status: true,
        message: "Success",
        data: userTasks,
      });
    }

    const userTasks = await prisma.blog.findMany({
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
  console.log(`server is running at port 5001`);
});
