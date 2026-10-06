import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { User } from "../models/User";
import { UserNotification } from "../models/UserNotification";


export const getNotifications = async(req:AuthRequest, res:Response) =>{
    try{
        const user = await User.findOne({ firebaseUid:req.firebaseUser!.uid}).select("_id").lean();
        if(!user){
            return res.status(404).json({ error:"user not found"})
        }

        const [notifications, unreadCount] = await Promise.all([
            UserNotification.find({ user: user._id}).sort({ createdAt:-1}).limit(50).lean(),
            UserNotification.countDocuments({user:user._id, read: false}),
        ]);
        res.status(200).json({ notifications, unreadCount});
    }catch(err){
        console.error("Get notifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
    }
}

export const markAllAsRead = async (req:AuthRequest, res:Response)=>{
    try{
        const user = await User.findOne({firebaseUid:req.firebaseUser!.uid}).select("_id");
        if(!user){
            return res.status(404).json({ error:"User not found"});
        }

        await UserNotification.updateMany(
            {user:user._id, read:false},
            {$set:{read:true}}
        );
        res.status(200).json({success:true});
    } catch(err){
        console.error("Mark all as read error:", err);
    res.status(500).json({ error: "Failed to mark notifications as read" });
    }
}