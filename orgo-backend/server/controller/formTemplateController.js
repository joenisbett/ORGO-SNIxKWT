import asyncHandler from "express-async-handler";
import {FormTemplate} from "../models/formTemplateModel.js";
import { createCType } from "../utils/kilt.js";


//@desc  create a form template
//@route   Post /api/templates/create
//@access  private
//desc  
const createATemplate = asyncHandler(async (req, res) => {
 const {input,taskId,name} = req.body;
    const template = new FormTemplate({formTemplate:input,createdBy:req.user._id,taskId:taskId,name});
    const  saved = await template.save();
    if(saved){

         await createCType(req.user._id,saved)
 
    res.json(template);
    }else{  
    res.json({msg:'Error creating template'});
    }
});

//@desc  delete a form template
//@route   Post /api/templates/delete/:id
//@access  private
//desc   
const deleteATemplate = asyncHandler(async (req, res) => {
    const template = await FormTemplate.findOne({_id:req.params.id,inactive:false});
    if(template){
        template.inactive = true;
        const saved = await template.save();
        if(saved){
            res.json({msg:'Template deleted successfully'});
        }
    }else{
        res.json({msg:'Template not found'});
    }


 });

 //@desc  get a form template
//@route   Post /api/templates/get/:id
//@access  private
//desc   
const getATemplate = asyncHandler(async (req, res) => {
    const template = await FormTemplate.findOne({_id:req.params.id,inactive:false}).populate("taskId");;
    if(template){
        res.json(template);
    }
    else{
        res.json({msg:'Template not found'});
    }

});

//@desc  get a form template by taskID
//@route   Post /api/templates/getbytaskid/:taskId
//@access  private
//desc   
const getATemplateByTaskId = asyncHandler(async (req, res) => {
    const template = await FormTemplate.findOne({taskId:req.params.taskId,inactive:false}).populate("taskId");;
    if(template){
        res.json(template);
    }
    else{
        res.json({msg:'Template not found'});
    } 

});
 //@desc  get all form templates
//@route   Post /api/templates/getall
//@access  private
//desc   
const getAllTemplates = asyncHandler(async (req, res) => {
    const template = await FormTemplate.find({inactive:false}).populate("taskId");;
    if(template){
        res.json(template);
    }
    else{
        res.json({msg:'Template not found'});
    }


});
 //@desc  get  all form templates created by a user
//@route   Post /api/templates/getall/byuser/:id
//@access  private
//desc   
const getAllTemplatesByAUser = asyncHandler(async (req, res) => {
    const template = 
    await FormTemplate
    .find({createdBy:req.params.id,inactive:false})
    .populate("taskId");
    if(template){
        res.json(template);
    }
    else{
        res.json({msg:'Template not found'});
    }


});
 //@desc  edit a form template
//@route   Post /api/templates/edit/:id
//@access  private
//desc   
const editATemplate = asyncHandler(async (req, res) => {
    const {input} = req.body;
    const template = await FormTemplate.findOne({_id:req.params.id,inactive:false});
    if(template){
        // template.label = label || template.label;
        // template.placeholder = placeholder || template.placeholder;
        // template.helperText = helperText || template.helperText;
        // template.isRequired = isRequired || template.isRequired;
        // template.howMany = howMany || template.howMany;
        // template.options = options || template.options;
        // template.type = type || template.type;
        template.formTemplate = input || template.formTemplate;
        template.taskId = req.body.taskId || template.taskId;

        const saved = await template.save();
        if(saved){
            res.json(saved);
        }
    }else{
        res.json({msg:'Template not found'});
    }


});


export {createATemplate,deleteATemplate,editATemplate,getAllTemplates,getAllTemplatesByAUser,getATemplate,getATemplateByTaskId};


