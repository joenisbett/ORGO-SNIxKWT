import express from "express";
const router = express.Router();
import {
  approveEvidence,
  deleteAComment,
  denyEvidence,
  getAllEvidences,
  getAllEvidencesCommunity,
  getAllEvidencesTask,
  getEvidenceById,
  getEvidenceCredentials,
  postAComment,
  submitEvidence,
} from "../controller/evidenceController.js";
import { protect, community } from "../middleware/authMiddleware.js";

router.post("/submit", protect, submitEvidence);
router.post("/approve/:evidenceId", protect, community, approveEvidence);
router.post("/deny/:evidenceId", protect, community, denyEvidence);
router.get("/:userId", getAllEvidences);
router.get("/community/:communityId", getAllEvidencesCommunity);
router.get("/task/:taskId", getAllEvidencesTask);

router.get("/evidence/:id", getEvidenceById);
router.get("/evidence/credentials/:id/:userId", getEvidenceCredentials);

router.post("/add/comment/:id",protect, postAComment);
router.delete("/delete/comment/:evidenceId/:commentId", deleteAComment);



export default router;
