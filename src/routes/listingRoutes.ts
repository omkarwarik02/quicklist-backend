import { Router } from "express";
import { createListing, getMyListings, deleteListing, getAllListings, getListingById,getNearByListings } from "../controllers/listingController";

import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyFirebaseToken, createListing);

router.get("/self-listing", verifyFirebaseToken, getMyListings);
router.get("/nearby", verifyFirebaseToken, getNearByListings);
router.delete("/:id", verifyFirebaseToken, deleteListing);
router.get("/", verifyFirebaseToken, getAllListings);
router.get("/:id", verifyFirebaseToken, getListingById);

export default router;