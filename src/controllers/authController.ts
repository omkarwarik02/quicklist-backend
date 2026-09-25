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