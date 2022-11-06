import mongoose from "mongoose";

const involvedUsersSchema = mongoose.Schema({
  
    userId:{
      type:String
    },
    seen:{
      type:Boolean,
      default:false,
      required:true
    },
    linkTo:{
      type:String
    },
  
})

const notificationSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required:true,
       
    },
    involvedUsers:[involvedUsersSchema],
    
    type:{
      type:String,
    },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  
    inactive:{
      type:Boolean,
      default:false,
      required:true
    }
   
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
