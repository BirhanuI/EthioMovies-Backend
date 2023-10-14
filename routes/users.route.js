import express from "express";
import Jwt from "jsonwebtoken";
import userController from "../controller/customer.controller.js";


const user = express.Router();
user.post("/signup", async (req, res) => {
  const user = await userController.addCustomer(req.body);
  if (!Object.keys(user).length == 0) {
    const token = Jwt.sign(
      {
        name: user.firstname,
        id: user._id,
        isSubscribed: user.isSubscribed,
        isAdmin: user.isAdmin,
      },
      "privateKey"
    );
    res.send(token);
  } else res.send({});
});
user.post("/login", async (req, res) => {
  const response = await userController.login(req.body);
  res.send(response);
});
user.post("/comment", async (req, res) => {
  try {
    const data = await userController.addComment(req.body);
    res.send(data);
  } catch (ex) {
    console.log(ex);
  }
});
user.post("/comment/all", async (req, res) => {
  try {
    const comments = await userController.getComment(req.body.id);
    console.log(req.body);
    res.send(comments);
  } catch (ex) {
    console.log(ex);
  }
});
user.post("/forgotpassword", async (req, res) => {
  const link = await userController.forgotPassword(req.body.email);
  // userController.sendRestLink(link);
  res.send(link);
});
user.get("/resetpassword/:token", (req, res) => {
  res.send(req.params.token);
});
user.post("/payment/:id", async (req, res) => {
  const {id} = req.params;
  const link = await userController.payment({...req.body,id});
  res.send(link);
});
user.post("/verifypayment",async(req,res)=>{
  const verifcation = await userController.verifyPayment(req.body);
  await userController.subscribe(verifcation);
  console.log(verifcation)
  res.send(verifcation);
})
user.post("/check",async (req,res)=>{
  const token = await userController.verifyUser(req.body);
  res.send(token);
})
user.post("/timeleft",async (req,res)=>{
  const time = await userController.timeLeft(req.body.id);
  res.send(`${time}`);
});
user.get('/getuser',async (req,res)=>{
  const user = await userController.getUser();
  res.send(user);
})
export default user;
