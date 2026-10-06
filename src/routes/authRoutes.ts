import { Router } from "express";
import { syncUser,getCurrentUser, updateProfile,addInterest, getInterests, savePushToken, updateLastKnownLocation } from "../controllers/authController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();


router.post("/sync", verifyFirebaseToken, syncUser);
router.get("/me", verifyFirebaseToken, getCurrentUser);
router.patch("/me", verifyFirebaseToken, updateProfile);
router.post("/interests/:listingId", verifyFirebaseToken, addInterest);
router.get("/interests", verifyFirebaseToken, getInterests);
router.patch("/push-token", verifyFirebaseToken, savePushToken);
router.patch("/location", verifyFirebaseToken, updateLastKnownLocation);
export default router;