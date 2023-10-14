import mongoose from "mongoose";

const commentModel = mongoose.model("comment",mongoose.Schema({
    username:String,
    movieTitle:String,
    date:Date,
}));
export default commentModel;