import mongoose from "mongoose";


const requirementSchema  = mongoose.Schema(
  {
    taskId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    type:{
      type:String,
      required:true,
      default:"task"
    },
    title:{
      type:String,
    },
    quantity:{
      type:Number,
    },
    price:{
      type:Number,
    },
    orgoCredits:{
      type:Number,
    },
  },
  {
    timestamps:true
  }
)


const sponsorShipSchema = mongoose.Schema(
  {
    name:{
        type:String,
        required:true,
    },
    description:{
      type:String,
      required:true,
  },
    requirementsToComplete:[requirementSchema],
    category:{type:Array},
    budgetNarrative:{
        type:String,
    },
    totalBudget:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    status:{
      type:String,
      default:"active",
      required:true,
  },
  inactive:{
    type:Boolean,
    required:true,
    default:false
},

    createrCommunity:{
        type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
    createrVolunteer:{
        type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }

  },
  {
    timestamps: true,
  }
);

const Sponsorship = mongoose.model("Sponsorship", sponsorShipSchema);

export default Sponsorship;
