import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
    firebaseUid: string;
    name: string;
    email: string;
    photoUrl?: string;
    phone?:string;
     location?: string;
    interestedListings: Types.ObjectId[];
    pushToken?:string;
    lastKnownLocation?:{
        type:"Point";
        coordinates:number[];
    }
    createdAt:Date;
}

const userSchema = new Schema<IUser>({
    firebaseUid:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    photoUrl:{type:String},
    phone:{type:String},
     location: { type: String }, 
     interestedListings: [{ type: Schema.Types.ObjectId, ref: "Listing", default: [] }],
     pushToken:{type:String},
     lastKnownLocation:{type:{type:String, enum:["Point"]},
     coordinates:{ type:[Number]},
    },
    createdAt:{type:Date, default:Date.now},
});


userSchema.index({ lastKnownLocation:"2dsphere"});
export const User = mongoose.model<IUser>("User",userSchema);