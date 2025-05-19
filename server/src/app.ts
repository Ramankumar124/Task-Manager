import { Express, urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./utils/passport";
import session from "express-session";

import { authRoutes } from "./routes/auth.route";
import logger from "./utils/logger";
import morgan from "morgan";
import errorHandler from "./middlewares/ErrorHandler.middleware";
import { jwtVerify } from "./middlewares/verify.middleware";
import { taskRoutes } from "./routes/task.routes";
const app: Express = express();

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: any) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.use(urlencoded({ extended: true, limit: "1mb" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const ALLOWED_ORIGINS: string[] = [
  process.env.CLIENT_URL as string,
  "http://localhost:5173",
];
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", jwtVerify, taskRoutes);

app.use(errorHandler);

export default app;
