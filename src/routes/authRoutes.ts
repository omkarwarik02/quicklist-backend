import { Router } from "express";
import { syncUser,getCurrentUser, updateProfile } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();


router.post("/sync", verifyFirebaseToken, syncUser);
router.get("/me", verifyFirebaseToken, getCurrentUser);
router.patch("/me", verifyFirebaseToken, updateProfile);
export default router;