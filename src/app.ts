import express, { Request, Response, NextFunction } from "express";

import usersRouter from "./routes/users";

import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../config/dev.env" });

let app = express();
app.use(express.json());

app.use([usersRouter]);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "URL NOT FOUND!" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  let status = err.status || 500;
  res.status(status).json({ success: false, message: err.message });
});

export default app;
