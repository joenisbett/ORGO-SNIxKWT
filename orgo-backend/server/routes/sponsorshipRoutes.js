import express from "express";
const router = express.Router();
import {
 createProject,deleteProject,editProject,getProjectById,getAllProjects,getFeaturedProjects,getLatestProjects,retireProject
 
} from "../controller/sponsorshipController.js";
import { protect } from "../middleware/authMiddleware.js";
 
router.post("/create", createProject);
router.post("/delete/:id",  deleteProject);
router.post("/edit/:id",  editProject);
router.get("/getById/:id",  getProjectById);
router.get("/getAll", getAllProjects);
router.get("/getAllFeatured",  getFeaturedProjects);
router.get("/getAllLatest",  getLatestProjects);
router.post("/retire/:id",  retireProject);



 
 







export default router;
