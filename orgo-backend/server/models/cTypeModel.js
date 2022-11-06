import mongoose from "mongoose";


const ctypeSchema = mongoose.Schema({
  userId:{type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",},
    ctype:{type:String}
   
}, { timestamps: true });


const CtypeAccount = mongoose.model("CtypeAccount", ctypeSchema);

export default CtypeAccount;