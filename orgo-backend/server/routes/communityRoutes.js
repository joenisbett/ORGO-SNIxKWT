import express from "express";
const router = express.Router();
import {
  createCommunity, upadateCommunity,deleteCommunity,getCommunityById,getCommunityName,getAllCommunities,getAllCommunitiesByUserId,
  getAllCommunitiesLocation,getAllCommunitiesWithinALocation,approveMembership,createANewMember, deleteAMember, getAllMembers,createCommunityWithUserName, searchCommunity
  // ,responseToCommunity
 
} from "../controller/communityController.js";
import { protect, community } from "../middleware/authMiddleware.js";

router.post("/create", protect, createCommunity);
router.post("/create/:username",  createCommunityWithUserName);
router.post("/update/:communityId", protect, upadateCommunity)
router.post("/delete/:communityId", protect,community, deleteCommunity);
router.get("/get/:id",getCommunityById)
router.get("/getbyname/:name",getCommunityName)
router.get("/search/:name",searchCommunity)
router.get("/getall",getAllCommunities)
router.get("/getall/:userId",getAllCommunitiesByUserId)
router.get("/getalllocation",getAllCommunitiesLocation)
router.get("/getall/location/:location",getAllCommunitiesWithinALocation)
router.post("/approve/members/:communityId/:userId",protect,approveMembership)
router.post("/add/member/:communityId/:userId",protect,community,createANewMember)
router.post("/delete/member/:communityId/:userId",protect,community,deleteAMember)
router.get("/get/member/:communityId",protect,community,getAllMembers)




// router.post("/respond/request/:communityId",protect,responseToCommunity)






export default router;
