import mongoose from "mongoose";

const inputFieldSchema = mongoose.Schema({
  
   label: {

        type: String,
        required: true,
        trim: true,

    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
placeholder: {
        type: String,
        trim: true,
    },
    helperText: {
        type: String,
        trim: true,
    },
    isRequired: {
        type: Boolean,
        required: true,
        trim: true,
    },
    howMany: {
        type: Number,
        trim: true,
    },
    options: {
        type: Array,
    },
  
})

const formTemplateSchema = mongoose.Schema(
  {
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Task",
    },
    name:{
      type:String,
    },
    
    formTemplate:[inputFieldSchema],
    createdBy:{
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

const FormTemplate = mongoose.model("Form", formTemplateSchema);

export  {FormTemplate,formTemplateSchema};
