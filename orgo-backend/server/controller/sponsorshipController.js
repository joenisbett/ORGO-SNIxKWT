import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Sponsorship from "../models/sponsorshipModel.js";


//@desc Create a project
//@route   POST /api/sponsorships/create
//@access  private
//desc  create a project in the sponsorship marketplace
const createProject = asyncHandler(async (req, res) => {
    const {name,description,requirementsToComplete, totalBudget,image, status,createrCommunity } = req.body;
    const project = new Sponsorship({name,description,requirementsToComplete, totalBudget,image, status,createrCommunity });
    const  saved = await project.save();
    if(saved){
    res.json(project);
    }else{  
    res.json({msg:'Error creating project'});
    }
      });

//@desc Delete a Project
//@route   POST /api/sponsorships/delete/:id
//@access  private
//desc delete  a project and that makes the project inactive true 
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Sponsorship.findById(req.params.id);
      if (project) {
        project.inactive = true;
        await project.save();
        res.json("Project Deactivated");
      } else {
        res.json("There is no such Project");
      }
});

//@desc Edit a Project
//@route   POST /api/sponsorships/edit/:id
//@access  private
//desc  get all notifications of a user
const editProject = asyncHandler(async (req, res) => {

    const {name,description,requirementsToComplete, totalBudget,image, status,createrCommunity } = req.body;

    const project = await Sponsorship.findById(req.params.id);
      if (project) {
        
        project.name=name||project.name,
        project.description = description||project.description,
        project.requirementsToComplete=requirementsToComplete||project.requirementsToComplete,
        project.totalBudget=totalBudget||project.totalBudget,
        project.image=image||project.image, 
        project.status=status||project.status,
        await project.save();
        res.json(project);
      } else {
        res.json("There is no such Project");
      }
});

//@desc Get a Project bu Id
//@route   get /api/sponsorships/getById/:id
//@access  private
//desc  get all notifications of a user
const getProjectById = asyncHandler(async (req, res) => {
    const project = await Sponsorship.findById(req.params.id).populate({
      path:'requirementsToComplete',
      populate:{
        path:'taskId',
        model:'Task'
      }
    })
    if (project) {
        res.json(project)
    }
    else{
        res.json("No project found")
    }
      
});

//@desc Get all Project
//@route   get /api/sponsorships/getAll
//@access  private
//desc  get all notifications of a user
const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Sponsorship.find({inactive:false});
    if (projects) {
        res.json(projects)
    }
    else{
        res.json("No project found")
    }
});

//@desc Get all featured projects
//@route   get /api/sponsorships/getAllFeatured 
//@access  private
//desc  
const getFeaturedProjects = asyncHandler(async (req, res) => {
    
});


//@desc Get all latest projects
//@route   get /api/sponsorships/getAllLatest
//@access  private
//desc  
const getLatestProjects = asyncHandler(async (req, res) => {
    const projects = await Sponsorship.find({inactive:false,status:"active"}).sort({createdDate:-1}).limit(10);
    if (projects) {
        res.json(projects)
    }
    else{
        res.json("No project found")
    }
});

//@desc Retire a project
//@route   POST /api/sponsorships/retire/:id
//@access  private
//desc  
const retireProject = asyncHandler(async (req, res) => {
    const project = await Sponsorship.findById(req.params.id);
      if (project) {
        project.status = "retired";
        await project.save();
        res.json("Project retired");
      } else {
        res.json("There is no such Project");
      }
});



      export {
        createProject,deleteProject,editProject,getProjectById,getAllProjects,getFeaturedProjects,getLatestProjects,retireProject
     
      };
      