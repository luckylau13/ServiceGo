import mongoose from "mongoose";
import appConfig from "./config";
mongoose.Promise = global.Promise;

export const connect = (config = appConfig) =>
  mongoose
    .connect(config.db.url, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB!!"))
    .catch(err => console.log(err));


