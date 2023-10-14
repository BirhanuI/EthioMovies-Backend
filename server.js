import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import movie from "./routes/movies.route.js";
import user from "./routes/users.route.js";
import admin from "./routes/admin.route.js";
const app = new express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("./public"));
app.use("/api/v1/movies", movie);
app.use("/g2movies/user", user);
app.use("/*", (req, res) => {
  res.status(404).send("Page not found");
});

export default app;
