//has to be on the very top
import "express-async-errors";
//has to be high
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import morgan from "morgan";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import cookieParser from "cookie-parser";

//Routers
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

//PUBLIC
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

//Cloudinary to keep images during production
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//for uploads
const __dirname = dirname(fileURLToPath(import.meta.url));

//depending on NODE_ENV variable from .env file use morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//upload
app.use(express.static(path.resolve(__dirname, "./public")));
//use cookie parser
app.use(cookieParser());
//use express.js
app.use(express.json());

//GET EXAMPLE
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

//use routers
app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

//NOT FOUNT Middleware
app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

//ERROR Middleware (Has to be the last one)
app.use(errorHandlerMiddleware);

//app.listen with variable from .env file
const port = process.env.PORT || 5100;

//Connect to DB and port listener
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

//SOME PARTS REMOVED DURING THE COURSE WICH I WANT TO KEEP AS PRIMITIVE EXAMPLES ------------------------------------------------

//NEW feature in node.js to use fetch API and Global await (top-level await):

// try {
//   const response = await fetch(
//     "https://www.course-api.com/react-useReducer-cart-project"
//   );
//   const cartData = await response.json();
//   console.log(cartData);
// } catch (error) {
//   console.log(error);
// }

//BASIC CRUD WITH ARRAY EXAMPLE

// //creating local jobs for basic local CRUD
// let jobs = [
//   { id: nanoid(), company: "apple", position: "front-end" },
//   { id: nanoid(), company: "google", position: "back-end" },
// ];

// //depending on NODE_ENV variable from .env file use morgan
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// //use express.js
// app.use(express.json());

// //GET EXAMPLE
// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// //POST EXAMPLE
// app.post("/", (req, res) => {
//   console.log(req);
//
// //GET All Jobs
// app.get("/api/v1/jobs", (req, res) => {
//   res.status(200).json({ jobs });
// });

// //Create job
// app.post("/api/v1/jobs", (req, res) => {
//   const { company, position } = req.body;
//   if (!company || !position) {
//     res.status(400).json({ msg: "please provide company and position" });
//     return;
//   }
//   const id = nanoid(10);
//   // console.log(id);
//   const job = { id, company, position };
//   jobs.push(job);
//   res.status(201).json({ job });
// });

// //Get Single Job
// app.get("/api/v1/jobs/:id", (req, res) => {
//   const { id } = req.params;
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     throw new Error("no job with that id"); //will goa as 500 error
//     res.status(404).json({ msg: `no job with id ${id}` });
//     return;
//   }
//   res.status(200).json({ job });
// });

// //Edit Job
// app.patch("/api/v1/jobs/:id", (req, res) => {
//   const { company, position } = req.body;
//   if (!company || !position) {
//     return res.status(400).json({ msg: "please provide company and position" });
//   }
//   const { id } = req.params;
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     return res.status(404).json({ msg: `no job with id ${id}` });
//   }

//   job.company = company;
//   job.position = position;
//   res.status(200).json({ msg: "job modified", job });
// });

// //Delete Job
// app.delete("/api/v1/jobs/:id", (req, res) => {
//   const { id } = req.params;
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     return res.status(404).json({ msg: `no job with id ${id}` });
//   }
//   const newJobs = jobs.filter((job) => job.id !== id);
//   jobs = newJobs;

//   res.status(200).json({ msg: "job deleted" });
// });

//   res.json({ message: "Data received", data: req.body });
// });

//EXAMPLE OF "VANILLA" VALIDATION -----------------------------------

//adding validation
// import { body, validationResult } from "express-validator";

//POST EXAMPLE
// app.post(
//   "/api/v1/test",
//   //validation part with chained validation
//   [body("name").notEmpty().withMessage("name is required")],
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       //mapping through errors
//       const errorMessages = errors.array().map((error) => error.msg);
//       return res.status(400).json({ errors: errorMessages });
//     }
//     next();
//   },

//   (req, res) => {
//     const { name } = req.body;
//     res.json({ msg: `hello ${name}` });
//   }
// );
