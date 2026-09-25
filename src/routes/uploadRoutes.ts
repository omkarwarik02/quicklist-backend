import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage()});


router.post("/", verifyFirebaseToken, upload.single("image"), async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({ error: "No file provided" });
        }
        const uploadResult = await new Promise((resolve, reject)=>{
            cloudinary.uploader.upload_stream({folder:"quicklist"},(error,result)=>{
                if(error) reject(error);
                else resolve(result);
            })
            .end(req.file!.buffer)
        });
          res.status(200).json({ url: (uploadResult as any).secure_url })

    } catch(error){
         console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed" });
    }
});
export default router;