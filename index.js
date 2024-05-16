const express = require("express");
const { prisma } = require("./db");
const app = express();
const cors = require("cors");
// const puppeteer = require("puppeteer");
// const axios = require("axios");
// const fs = require("fs");
// const FormData = require("form-data");
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

app.post("/todo", async (req, res) => {
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

app.post("/add-blog", async (req, res) => {
  const { user_id, title, summary, categories, created_on, image } = req.body;
  if (!user_id || !title || !summary || !categories || !created_on) {
    return res.status(422).json("fill all the fields111");
  }
  try {
    const newBlog = await prisma.blog.create({
      data: {
        user_id,
        title,
        summary,
        categories,
        created_on,
        image,
      },
    });
    res
      .status(201)
      .json({ status: true, message: "Blog created successfully" });
  } catch (err) {
    console.info("err", err);
    res.status(400).json({ status: true, message: "Something went wrnong" });
  }
});

app.get("/blogs", async (req, res) => {
  const { user_id } = req.body;

  try {
    console.log("req.body", req.body);
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

app.post("/blogs", async (req, res) => {
  const { user_id } = req.body;

  try {
    console.log("req.body", req.body);
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

// async function generatePDF(url, outputPath) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   await page.goto(url, {
//     waitUntil: "networkidle0",
//   });
//   await page.pdf({ path: outputPath, format: "A4", printBackground: true });

//   await browser.close();
// }

// app.post("/generate", async (req, res) => {
//   const urlPath = req.body.url;
//   try {
//     const pdfFilePath = "public/google.pdf";

//     // Generate PDF
//     await generatePDF(
//       // `http://192.168.0.84:3000/task-report/${id}`, // Replace with live url here
//       urlPath,
//       pdfFilePath
//     );

//     // Create FormData
//     const formData = new FormData();
//     // console.log("file+++",fs.createReadStream(pdfFilePath))
//     formData.append("file", fs.createReadStream(pdfFilePath));

//     // Send FormData using axios
//     const response = await fetch("https://stg-apis.keylr.com/upload_file_s3", {
//       method: "POST",
//       body: formData,
//       headers: {
//         // Make sure to set the content type to multipart/form-data for file uploads
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     // fs.unlink(pdfFilePath, (err) => {
//     //   if (err) {
//     //     console.error("Error deleting PDF file:", err);
//     //   } else {
//     //     console.log("PDF file deleted successfully");
//     //   }
//     // });
//     const resp = await response.json();
//     console.log("response", resp);
//     return res.status(200).json({
//       success: true,
//       message: "File uploaded successfully",
//       data: resp,
//     });
//   } catch (error) {
//     console.error("Error generating or uploading PDF:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error generating or uploading PDF",
//       error: error.message, // Return the error message for debugging
//     });
//   }
// });

app.listen(5002, () => {
  console.log(`server is running at port 5001`);
});
