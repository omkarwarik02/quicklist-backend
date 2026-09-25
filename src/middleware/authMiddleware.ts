import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import "../config/firebaseAdmin";

export interface AuthRequest extends Request {
  firebaseUser?: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  };
}

export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);

    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
    };

    next();
  } catch (error) {
     return res.status(401).json({ error: "Invalid or expired token" });
  }
};
