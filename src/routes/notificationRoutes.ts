import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware"; // same import as your other route files
import { getNotifications, markAllAsRead } from "../controllers/notificationController";

const router = Router();

router.get("/", verifyFirebaseToken, getNotifications);
router.patch("/read-all", verifyFirebaseToken, markAllAsRead);

export default router;