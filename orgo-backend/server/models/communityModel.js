import mongoose from "mongoose";


const memberSchema = mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",},
    role: {
        type:String,
        required:true,
        default:"admin"
    },
    status: {
        type:String,
        required:true,
        default:"pending"
    }
   
}, { timestamps: true });

const communitySchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",

    },
    city:{
      type:String,
    },
    phone: {
      type: String,
    },
    description:{
      type:String,
    },
    moto:{
        type:String,
      },
    profileImage: {
      type: String,
    },
    logo: {
        type: String,
      },
    inactive: {
      type: Boolean,
      required: true,
      default: false,
    },
    facebookLink: {
      type: String,
    },
    linkedinLink: {
      type: String,
    },
    instagramLink: {
      type: String,
    },
    redditLink: {
      type: String,
    },
    twitterLink: {
      type: String,
    },
    website:{
      type:String
    },
    verified:{
      type:Boolean,
      required:true,
      default:false
    },
    termsAndConditionsChecked:{
      type:Boolean,
      required:true,
      default:false
    },
    locationOnMap:{
      latitude:{
        type:String,
      },
      longitude:{
        type:String,
    }}
    ,
    members:[memberSchema]
  },
  {
    timestamps: true,
  }
);

const Community = mongoose.model("Community", communitySchema);

export default Community;
