import { Response } from "express";
import { Listing } from "../models/Listing";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";


export const createListing = async (req:AuthRequest, res:Response) =>{
    try{

    
    const { photos, title, category, price, description, location } = req.body;

    if(!photos || !title || !category || !price || !description || !location){
        return res.status(400).json({error:"Missing required fields"});
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
      description,
      location,
    });
    res.status(201).json({ listing});
} catch(error){
    console.error("Create listing error:", error);
    res.status(500).json({ error: "Failed to create listing" });
 }
}
