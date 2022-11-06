import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String, 
      required:true,
      
    }, 
    locationOnMap:{
      latitude:{
        type:String,
      },
      longitude:{
        type:String,
    }},
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Community",
    },
    creatorVolunteer:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    creatorCommunityName:{
      type:String,
    },
priority:{
  type:String,
  required:true,
  default:"medium"
},
hours:{
  type:String,
  
},
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
   
  
    status: {
      type: String,
      default:'active',
      required:true
    },

    rewards: {
      type: String,
    },
    evidence: {
      type: String,
      required: true,
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

const Task = mongoose.model("Task", taskSchema);

export default Task;
