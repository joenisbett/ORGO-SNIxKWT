import express from "express";
const router = express.Router();
import {
 
    attachImage,
    ReportABug
} from "../controller/clickupController.js";

router.post("/create",  ReportABug);
router.post("/attach",  attachImage);



export default router;
