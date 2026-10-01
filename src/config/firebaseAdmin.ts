import fs from "fs";
import path from "path";
import { initializeApp, cert } from "firebase-admin/app";

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ??
  path.join(process.cwd(), "serviceAccountKey.json");

const ServiceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

const app = initializeApp({
  credential: cert({
    projectId: ServiceAccount.project_id,
    privateKey: ServiceAccount.private_key,
    clientEmail: ServiceAccount.client_email,
  }),
});

export default app;