import { Vonage } from "@vonage/server-sdk";
import ypco from "yenepaysdk";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel, { commentModel ,subscribeModel} from "../models/user.model.js";

export default class userController {
  static async login({ email, password }) {
    const user = await userModel.findOne({ email });
    if (!user) {
      return false;
    } else {
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (passwordCheck) {
        const token = Jwt.sign(
          {
            name: user.firstname,
            id: user._id,
            isSubscribed: user.isSubscribed,
            isAdmin: user.isAdmin,
          },
          "privateKey"
        );
        return token;
      } else return false;
    }
  }
  static async addCustomer(data) {
    const user = await userModel.find({ email: data.email });
    if (!Object.keys(user).length == 0) {
      return {};
    } else {
      const password = await bcrypt.hash(data.password, 10);
      data.password = password;
      let body = { ...data, isSubscribed: false, isAdmin: false };
      const savedUser = await userModel.create(body);
      return savedUser;
    }
  }
  static async addComment(data) {
    try {
      const comment = await commentModel.create(data);
      return comment;
    } catch (ex) {
      console.log(ex);
    }
  }
  static async getComment(data) {
    try {
      const comment = await commentModel.find({ movieid: data });
      return comment;
    } catch (ex) {
      console.log(ex);
    }
  }
  static async forgotPassword(email) {
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("User Not Found");
      return { message: "user not found" };
    }
    const secretKey = "privateKey" + user.password;
    const token = Jwt.sign({ id: user._id }, secretKey, { expiresIn: "15m" });
    const link = `http://localhost:3000/resetpassword/${token}`;

    return link;
  }
  static async sendRestLink(link) {
    const vonage = new Vonage({
      apiKey: "30f5606b",
      apiSecret: "5hiZkrDx2rqYXL3M",
    });
    const from = "G2 Movies";
    const to = "251949157320";
    const text = `This is your reset password Link <${link}>`;

    await vonage.sms
      .send({ to, from, text })
      .then((resp) => {
        console.log("Message sent successfully");
        console.log(resp);
      })
      .catch((err) => {
        console.log("There was an error sending the messages.");
        console.error(err);
      });
  }
  static async payment({ price, type, id }) {
    const options = ypco.checkoutOptions(
      "SB2344",
      "",
      "Express",
      true,
      20,
      `http://localhost:3000/g2movies/payment/${id}`,
      `http://localhost:3000/g2movies/payment/${id}`,
      `http://localhost:3000/g2movies/payment/${id}`
    );
    const checkoutUrl = ypco.checkout.GetCheckoutUrlForExpress(options, {
      ItemName: type,
      UnitPrice: price,
    });
    return checkoutUrl;
  }
  static async verifyPayment(info) {
    let endDate;
    let packageType;
    const paid = (res) => {
      const amount = parseInt(res.TotalAmount);
      if (amount == 50) {
        endDate = Date.now() + 604800000;
        packageType = "week";
      } else if (amount == 170) {
        endDate = Date.now() + 2628000000;
        packageType = "month";
      } else {
        endDate = Date.now() + 31540000000;
        packageType = "yearly"
      }
      const data = {
        userid: info.id,
        startDate: Date.now(),
        endDate: endDate,
        packageType: packageType,
        TotalAmount: res.TotalAmount,
        orderId: res.MerchantOrderId,
        transactionId: res.TransactionId,
      };
      return data;
    };
    const pdt = ypco.pdtRequestModel(
      "jTm2iZixnDBUbz",
      info.TransactionId,
      info.MerchantOrderId,
      true
    );
  const pdtString =  await ypco.checkout.RequestPDT(pdt);
        const verification = paid(pdtString);
        return verification;
  }
  static async subscribe(info){
    if(info){
      const user = await subscribeModel.findOne({ orderId: info.orderId });
      if(!user){
        await subscribeModel.create(info);
        await userModel.updateOne({_id:info.userid},{isSubscribed:true});
      }
    }
  }
  static async verifyUser({ id }) {
    const user = await userModel.findOne({ _id: id });
    const token = Jwt.sign(
      {
        name: user.firstname,
        id: user._id,
        isSubscribed: user.isSubscribed,
        isAdmin: user.isAdmin,
      },
      "privateKey"
    );
    return token;
  }
  static async timeLeft(id){
    try {
      const time = await subscribeModel.findOne({userid:id});
      const endDate = parseInt(time.endDate);
        const timeLeft = endDate - parseInt(Date.now());
        
        return timeLeft; 
    } catch (error) {
      console.log(error)
    }
  }
  static async getUser(){
    const user = await userModel.find({});
    return user;
  }
}
