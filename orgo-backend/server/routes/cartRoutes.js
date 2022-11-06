import express from "express";
const router = express.Router();
import {
addCartItem,deleteCartItem,getCartItemsUser
 
} from "../controller/cartController.js";
import { protect, community } from "../middleware/authMiddleware.js";

router.post("/create",  addCartItem);
router.post("/delete/:userId/:projectId",  deleteCartItem);
router.get("/get/:userId",  getCartItemsUser);





 
 







export default router;
