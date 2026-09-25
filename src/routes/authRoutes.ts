import { Router } from "express";
import { syncUser } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();


router.post("/sync", verifyFirebaseToken, syncUser);

export default router;