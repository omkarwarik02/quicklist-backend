import { Response } from "express";
import { Listing } from "../models/Listing";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

import { notifyNearbyUsers } from "../utils/notifyNearByUsers";

export const createListing = async (req:AuthRequest, res:Response) =>{
    try{

    
    const { photos, title, category, price, phoneNumber, description, location } = req.body;

    if(!photos || !title || !category || !price || !phoneNumber || !description || !location){
        return res.status(400).json({error:"Missing required fields"});
    }

    if(typeof location.latitude !== "number" || typeof location.longitude !== "number"){
        return res.status(400).json({ error: "location.latitude and location.longitude are required"});
    }

    const seller = await User.findOne({firebaseUid:req.firebaseUser!.uid});

    if(!seller){
        return res.status(404).json({error:"Seller not found"});
    }

    const listing = await Listing.create({
        seller:seller._id,
        photos,
      title,
      category,
      price,
      phoneNumber,
      description,
      location:{
        name:location.name,
        latitude: location.latitude,
        longitude:location.longitude,
        geo:{
            type:"Point",
            coordinates:[location.longitude, location.latitude],
        }
      }
    });
    notifyNearbyUsers(listing).catch((err) =>
  console.error("Notify nearby users failed:", err)
);

    res.status(201).json({ listing});
} catch(error){
    console.error("Create listing error:", error);
    res.status(500).json({ error: "Failed to create listing" });
 }
}

export const getMyListings = async (req:AuthRequest, res:Response) => {
    try {
        const seller = await User.findOne({firebaseUid:req.firebaseUser!.uid}).lean()
       if(!seller) {
            return res.status(404).json({error:"Seller not found"});
        }
        const listings = await Listing.find({ seller: seller._id}).sort({ createdAt: -1}).lean();
        res.status(200).json({ listings});
    } catch(error){
        console.error("Get my listings error:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
    }
}

export const deleteListing = async (req: AuthRequest, res: Response) => {
    try{
        const seller = await User.findOne({ firebaseUid: req.firebaseUser!.uid});
        if(!seller) return res.status(404).json({ error:"Seller not found"});

        const listing = await Listing.findById(req.params.id);
        if(!listing) return res.status(404).json({ error: "Listing not found"});

        if(listing.seller.toString() !== seller._id.toString()){
            return res.status(403).json({ error: "Not authorized to delete this listing" });
        }
          await listing.deleteOne();
        res.status(200).json({ message: "Listing deleted" });

    } catch(error){
         console.error("Delete listing error:", error);
    res.status(500).json({ error: "Failed to delete listing" });
    }
}
export const getAllListings = async (req:AuthRequest, res:Response) =>{
    try {
        const page = Math.max(Number(req.query.page) || 1,1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
        const skip = (page - 1) * limit;

        

        const rows = await Listing.find({ status: "active"}).sort({createdAt: -1}).skip(skip).limit(limit + 1).lean();
        const hasMore = rows.length > limit;
        const listings = hasMore ? rows.slice(0, limit) : rows;
        res.status(200).json({ listings , page , hasMore});
    } catch(error){
        console.error("Get all listings error:", error);
        res.status(500).json({error: "Failed to fetch listings"});
    }
}

export const getListingById = async(req:AuthRequest, res:Response)=>{
    try{
        const listing = await Listing.findById(req.params.id).lean();
        if(!listing) return res.status(404).json({error: "Listing not found"})

            res.status(200).json({listing});
    } catch(error){
         console.error("Get listing by id error:", error);
        res.status(500).json({ error: "Failed to fetch listing" });
    }
}

export const getNearByListings = async (req:AuthRequest, res:Response)=>{
    try{
        const lat = Number(req.query.lat);
        const lng = Number(req.query.lng);
        const radiusKm = Number(req.query.radius) || 5;

        if(!Number.isFinite(lat) || !Number.isFinite(lng) || req.query.lat === undefined || req.query.lng === undefined){
             return res.status(400).json({ error: "lat and lng query params are required" });
        }

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
        const skip = (page - 1) * limit;

        const rows = await Listing.find({
            status:"active",
            "location.geo":{
                $near:{
                    $geometry:{type:"Point", coordinates:[lng,lat]},
                    $maxDistance: radiusKm * 1000,
                },
            },
        }).skip(skip)
        .limit(limit + 1)
        .lean();



        const hasMore = rows.length > limit;
        const listings = hasMore ? rows.slice(0, limit) : rows;
        res.status(200).json({ listings, page, hasMore})
    } catch(error){
        console.error("Get nearby listings error:", error);
        res.status(500).json({ error: "Failed to fetch nearby listings" });
    } 
}