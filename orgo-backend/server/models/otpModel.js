import mongoose from "mongoose";

const otpSchema = mongoose.Schema(
  {
   otp:{type:String,required:true},
   id:{type:String,required:true},
   createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
  },
  
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
