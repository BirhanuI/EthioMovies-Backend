import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  phone:String,
  password: String,
  isSubscribed:Boolean,
  isAdmin:Boolean,
});
const userModel = new mongoose.model("customer", userSchema);

export const commentModel = new mongoose.model("comment",mongoose.Schema({
  movieid:String,
  movie:String,
  user:String,
  userid:String,
  date:Date,
  comment:String,
}))
export const subscribeModel = new mongoose.model("subscribe",mongoose.Schema({
  userid:String,
  startDate:Number,
  endDate:Number,
  packageType:String,
  totalAmount:String,
  orderId:String,
  transactionId:String,
}));

export default userModel;
