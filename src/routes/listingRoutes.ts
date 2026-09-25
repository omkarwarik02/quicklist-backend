import { Router } from "express";
import { createListing } from "../controllers/listingController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyFirebaseToken, createListing);

export default router;