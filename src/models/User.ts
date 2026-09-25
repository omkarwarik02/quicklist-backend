import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    firebaseUid: string;
    name: string;
    email: string;
    photoUrl?: string;
    phone?:string;
    createdAt:Date;
}

const userSchema = new Schema<IUser>({
    firebaseUid:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    photoUrl:{type:String},
    phone:{type:String},
    createdAt:{type:Date, default:Date.now},
});



export const User = mongoose.model<IUser>("User",userSchema);