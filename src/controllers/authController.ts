import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

export const syncUser = async(req:AuthRequest, res: Response) => {
    try {

        const { uid, email, name, picture} = req.firebaseUser!;

        let user = await User.findOne({firebaseUid:uid});

        if(!user){
            user = await User.create({
                firebaseUid:uid,
                 name: name || "Unnamed User",
                 email:email,
                 photoUrl:picture
            });
        }
        res.status(200)
.json({ user });
    } catch(error){
        console.error("Sync user error:", error);
    res.status(500).json({ error: "Failed to sync user" });
    }
}

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser!.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const  updateProfile = async (req:AuthRequest, res:Response) =>{
  try{
    const { phone, location} = req.body;

    const user = await User.findOneAndUpdate(
      {firebaseUid: req.firebaseUser!.uid},
      { $set:{ phone, location}},
      { new:true}
    );

    if(!user){
      return res.status(404).json({ error : "User not found"});
    }
    res.status(200).json({ user});

  } catch(err){
     console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

export const addInterest = async(req:AuthRequest, res:Response) =>{
  try{
    const { listingId} = req.params;
    const user = await User.findOneAndUpdate(
      {firebaseUid:req.firebaseUser!.uid},
      {$addToSet:{interestedListings:listingId}},
      { new: true}
    );
    if(!user){
      return res.status(404).json({ error:"User not found"});
    }
    res.status(200).json({user});
  }catch(err){
    console.error("Add interest error:", err);
    res.status(500).json({ error: "Failed to save interest" });
  }
}
export const getInterests = async (req:AuthRequest, res:Response) =>{
  try{
    const user = await User.findOne({ firebaseUid: req.firebaseUser!.uid}).populate("interestedlistings");
    if(!user){
      return res.status(404).json({ error:"User not found"});
    }
    res.status(200).json({ listings: user.interestedListings });
  } catch(err){
    console.error("Get interests error:", err);
    res.status(500).json({ error: "Failed to fetch interests" });
  }
} 