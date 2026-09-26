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

export const getMyListings = async (req:AuthRequest, res:Response) => {
    try {
        const seller = await User.findOne({firebaseUid:req.firebaseUser!.uid})
       if(!seller) {
            return res.status(404).json({error:"Seller not found"});
        }
        const listings = await Listing.find({ seller: seller._id}).sort({ createdAt: -1});
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

    } catch(error){
         console.error("Delete listing error:", error);
    res.status(500).json({ error: "Failed to delete listing" });
    }
}
