import express from "express";
const router = express.Router();
import {
 
    createATemplate, deleteATemplate, editATemplate, getAllTemplates, getAllTemplatesByAUser, getATemplate, getATemplateByTaskId
} from "../controller/formTemplateController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/create", protect, createATemplate);
router.post("/delete/:id",  deleteATemplate);
router.get("/get/:id",  getATemplate);
router.get("/getbytaskid/:taskId",  getATemplateByTaskId);

router.get("/getall",  getAllTemplates);
router.get("/getall/byuser/:id",  getAllTemplatesByAUser);
router.post("/edit/:id",  editATemplate);




export default router;
