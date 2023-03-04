//importing modules
import express from "express";
import bodyParser from "body-parser";
import connectDb from "./db/connectDb.js";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

//importing routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postsRoutes.js";

//importing authorization midware and controllers
import { verifyToken } from "./middleware/authMidware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { register } from "./controllers/authCtrl.js";
import { createPost } from "./controllers/postsCtrl.js";

//configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

//start app
const app = express();

//middlware
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
); //all incoming requests will be allowed
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(errorHandler); //error handler

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

//File storage configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//Routes with files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//Routes
app.use("/auth", authRoutes); //authorization and authentication routes
app.use("/users", userRoutes); //routes for users
app.use("/posts", postRoutes); //routes for posts
app.use("*", (req, res) => {
  return res.sendFile(path.join(__dirname, "views", "404.html"));
}); //not found handler

//start db connection
const start = async () => {
  const port = process.env.PORT || 6001;
  try {
    //start db connection
    connectDb(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(`Server listening at ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};
start();
