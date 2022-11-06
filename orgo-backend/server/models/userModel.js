import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    address: {
      type: String,
    },
    city:{
      type:String,
    },
    phone: {
      type: String,
    },
    bio:{
      type:String,
    },
    type: {
      type: String,
      default: "volunteer",
      required: true,
    },
    avatar: {
      type: String,
    },
   points:{
    type:Number,
    default:0
   },
   rank:{
type:Number
   },

    inactive: {
      type: Boolean,
      required: true,
      default: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName:{
      type:String,
    },
    lastName:{
      type:String
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
  },
  {
    timestamps: true,
  }
);
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model("User", userSchema);

export default User;
