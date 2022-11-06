import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getSpecificUserProfile,
  meApi,
  testUniqueName,
  resendVerificationEmail,
  getAllUsers,
  verifyEmail,
  getLeaderBoard,
  createAndAttestCredentials,
  createKilt,
  getUserprofileStats
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/login", authUser);
// router.post("/login/community", authCommunityUser);

router.get("/me", protect, meApi);

router.get("/testUnique/:name",testUniqueName)

router.post("/register", registerUser);
router.post("/verify",verifyEmail)
router.post("/resendVerificationEmail", resendVerificationEmail);

router.route("/profile").put(protect, updateUserProfile);
router.route("/profile/:username").get( getSpecificUserProfile);

router.route("/:id").delete(protect, deleteUser)
router.route("/user/:name").get( getUsers);
router.route("/all").get( getAllUsers);
router.route("/leaderboard").get(getLeaderBoard)
router.route("/claim/attestaion/:volunteerId/:communityId").post(protect,createAndAttestCredentials)
router.route("/create/Kilt/:userId").post(protect,createKilt)
router.route("/profile/stats/:userId").get(protect,getUserprofileStats)

// router.route("/communityusers").get( getAllCommunityUsers);

router.route("/:id");

export default router;
