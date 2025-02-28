import express from "express";
import mongoose from "mongoose";
import { readdirSync } from "fs";

import cors from "cors";
import { verifyToken } from "./middlewares/checkAuth";

const app = express();
app.use(express.json());
app.use(cors());

const URL = 'mongodb+srv://thanh:123@cluster0.qaeoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

app.use(verifyToken)

mongoose
  .connect(URL)
  .then(() => console.log("DB Connected successfully"))
  .catch((error) => console.log("DB not connected ", error));
  readdirSync("./src/router").forEach((route) => {
    // console.log(route);
    app.use("/api", require(`./router/${route}`));
  });

  app.listen(4000, () => console.log("server is listening port: ", 4000));