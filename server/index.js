import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import conn from "./utils/db.js";
import userRouter from "./routes/user.route.js";
dotenv.config();

const app = express();
// routers obj

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

// api routers
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  conn();
  console.log(`server listening on port ${PORT}`);
});
