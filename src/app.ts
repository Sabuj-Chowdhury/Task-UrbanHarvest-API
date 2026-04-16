import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";
import { envVariable } from "./app/config/env";
import globalErrorhandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
const app: Application = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// router for the api endpoints
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "server is running...",
    environment: envVariable.NODE_ENV,
    uptime: process.uptime().toFixed(2) + " sec",
    timeStamp: new Date().toISOString(),
  });
});

app.use(globalErrorhandler);
app.use(notFound);

export default app;
