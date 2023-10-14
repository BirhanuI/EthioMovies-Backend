import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./server.js";

async function main() {
  dotenv.config();
  await mongoose.connect(process.env.MOVIES_DB);
  app.listen(process.env.PORT, () => {
    console.log("Running on port" + process.env.PORT);
  });
}
main();
