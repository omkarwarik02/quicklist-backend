import { Router } from "express";
import { syncUser,getCurrentUser } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();


router.post("/sync", verifyFirebaseToken, syncUser);
router.get("/me", verifyFirebaseToken, getCurrentUser);
export default router;