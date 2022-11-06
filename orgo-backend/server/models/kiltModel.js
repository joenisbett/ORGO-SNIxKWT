import mongoose from "mongoose";


const kiltSchema = mongoose.Schema({
  fullDid:{type: Object},
  lightDid:{type:Object},
  accountDetails:{type:Object},
  mneumonics:{type:String}, 
  publicKey:{type:String},
  user:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
   web3name:{type:String}
}, { timestamps: true });


const KiltAccount = mongoose.model("KiltAccount", kiltSchema);

export default KiltAccount;