import express from "express";
const router = express.Router();
import {
  deleteANotification,
  getAllNotifications,
  markNotificationSeen,

} from "../controller/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

router.get("/all/:userId", protect,  getAllNotifications);
router.post("/delete/:notificationId", protect,  deleteANotification);
router.post("/seen/:notificationId/:userId", protect,  markNotificationSeen);




export default router;
