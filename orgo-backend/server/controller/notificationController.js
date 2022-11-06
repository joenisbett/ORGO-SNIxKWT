import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";


//@desc Get all notifications
//@route   get /api/notificaions/all/:userId
//@access  private
//desc  get all notifications of a user
const getAllNotifications = asyncHandler(async (req, res) => {
    const notificaions = await Notification.find({involvedUsers:{$elemMatch:{userId:req.params.userId}}}).sort({createdAt:-1}).populate("userId");
    if(notificaions){
        res.json(notificaions)
    }else{
        res.send("No notifications")
    }
      });

      //@desc 
//@route   post /api/notificaions/delete/:notificationId
//@access  
//desc  
const deleteANotification = asyncHandler(async (req, res) => {
  const notificaion = await Notification.findOne({_id:req.params.notificationId});
  if(notificaion){
      notificaion.inactive = true;
      await notificaion.save();
  }else{
      res.send("No notifications")
  }
    });

       //@desc 
//@route   post /api/notificaions/seen/:notificationId/:userId
//@access  
//desc  
const markNotificationSeen = asyncHandler(async (req, res) => {
  const notificaion = await Notification.findOne({_id:req.params.notificationId});

  if(notificaion){ 
    const updatedNotification = notificaion?.involvedUsers?.map(user=>{
      if(user.userId.toString() === req.params.userId.toString()){
          user.seen = true;
      }
      return user;
  })
  notificaion.involvedUsers = updatedNotification;
  await notificaion.save();
  res.send("Notification seen")
  }else{
      res.send("No notifications")
  }
    });



      export {
        getAllNotifications,deleteANotification,markNotificationSeen
        
      };
      