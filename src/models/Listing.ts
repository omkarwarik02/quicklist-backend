import mongoose, { Schema, Document, Types } from "mongoose";

export interface IListing extends Document {
    seller:Types.ObjectId;
    photos:string[];
    title:string;
    category:string;
    price:number;
    description:string;
    location:{
        name:string;
        latitude:number;
        longitude:number
    };
    status:"active" | "completed";
    createdAt:Date
}

const lisitngSchema = new Schema<IListing>({
    seller:{type:Schema.Types.ObjectId, ref:"User", required:true},
    photos:{type:[String], required:true},
    title:{type:String, required:true},
    category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  location: {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  status:{type:String, enum:["active","completed"], default:"active"},
  createdAt:{type:Date, default:Date.now},
});



export const Listing = mongoose.model<IListing>("Listing",lisitngSchema);