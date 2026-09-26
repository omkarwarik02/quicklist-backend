import { Router } from "express";
import { createListing, getMyListings, deleteListing } from "../controllers/listingController";

import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyFirebaseToken, createListing);
router.get("/self-listing", verifyFirebaseToken, getMyListings);
router.delete("/:id", verifyFirebaseToken, deleteListing);


export default router;