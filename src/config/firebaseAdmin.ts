
import  ServiceAccount from "./quicklist-68917-firebase-adminsdk-fbsvc-dbfab27e39.json";
import { initializeApp, cert } from "firebase-admin/app";


const app = initializeApp({
    credential: cert({
        projectId:ServiceAccount.project_id,
        privateKey:ServiceAccount.private_key,
        clientEmail:ServiceAccount.client_email,  
    }),

});

export default app;