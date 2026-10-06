import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserNotification extends Document {
  user: Types.ObjectId;
  title: string;
  body: string;
  listing?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const userNotificationSchema = new Schema<IUserNotification>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  listing: { type: Schema.Types.ObjectId, ref: "Listing" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const UserNotification = mongoose.model<IUserNotification>(
  "UserNotification",
  userNotificationSchema
);