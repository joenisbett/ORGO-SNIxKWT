import express from "express";
const router = express.Router();
import {
  createTask,
  getAllTask,
  // getAllMyTask,
  getAllCommunityTask,
  updateATask,
  getATask,
  deleteATask,
  getAllLocation,
  getTasksWithinLocation,
  createMultipleTask,
  // enrollInATask,
  // leaveATask,
} from "../controller/taskController.js";
import { protect, community } from "../middleware/authMiddleware.js";

router.post("/create", protect, community, createTask);
router.post("/create/multiple", protect, community, createMultipleTask);
// router.post("/enroll/:userId/:taskId", protect, enrollInATask);
// router.post("/leave/:userId/:taskId", protect, leaveATask);

router.get("/address", getAllLocation);
router.get("/task_address/:address", getTasksWithinLocation);
router.get("/", getAllTask);

// router.get("/volunteer/:id", protect, getAllMyTask);
router.get("/community/:id",  getAllCommunityTask);

router
  .route("/task/:id")
  .put(updateATask) 
  .get(getATask)
  .delete(protect, community, deleteATask);

export default router;
