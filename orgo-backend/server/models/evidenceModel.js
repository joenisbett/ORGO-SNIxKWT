import mongoose from "mongoose";

const commentSchema  = mongoose.Schema(
  {
    sender:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    message:{
      type:String,
    }
  },
  {
    timestamps:true
  }
)
// const formDataSchema  = mongoose.Schema(
//   {
//     label: {
//       type: String,
//       trim: true,
//     },
//   value: {
//     type: String,
//   }
//   },
//   {
//     timestamps:true
//   }
// )

const evidenceSchema = mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Task",
    },
    name:{
      type:String
    },
    templateId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "FormTemplate",
    },
    formData:{type:Array},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // evidenceDetails: {
    //   type: String,
    //   required: true,
    // },
    // latitude:{
    //   type:String,
    // },
    // longitude:{
    // type:String
    // },
    status: { type: String, required: true, default: "To be approved" }, 
    statusApprovedDate:{type:Date},
    reason:{type:String},
    // evidenceImages: {type: Array},
    comments:[commentSchema],
    helpers: [{id:{ type: mongoose.Schema.Types.ObjectId,
      
      ref: "User",}}],
  },
  {
    timestamps: true,
  }
);

const Evidence = mongoose.model("Evidence", evidenceSchema);

export default Evidence;
