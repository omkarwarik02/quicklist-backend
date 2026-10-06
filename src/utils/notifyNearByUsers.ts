import { User } from "../models/User";
import { UserNotification } from "../models/UserNotification";


type NewListing = {
    _id:any;
    title:string;
    seller:any;
    location: {geo:{type:"Point"; coordinates:number[]}};
};

export async function notifyNearbyUsers(listing:NewListing, radiusKm = 10){
    const nearbyUsers = await User.find({
        _id:{ $ne:listing.seller},
        lastKnownLocation:{
            $near:{
                $geometery:{
                    type:"Point",
                    coordinates:listing.location.geo.coordinates,
                },
                $maxDistance:radiusKm * 1000,
            },
        },
    }).select("pushToken");

    if(nearbyUsers.length === 0) return

    await UserNotification.insertMany(
        nearbyUsers.map((u)=>({
            user:u._id,
            title:"New listing near you",
            body:listing.title,
            listing:listing._id
        }))
    );
const messages = nearbyUsers
.filter((u)=>u.pushToken)
.map((u)=>({
    to:u.pushToken,
    sound:"default",
    title:"New listing near you",
    body:listing.title
}));

for(let i = 0; i < messages.length; i += 100){
    const chunk = messages.slice(i,i + 100);
    const response = await fetch("https://exp.host/--/api/v2/push/send",{
        method:"POST",
        headers:{Accept: "application/json", "Content-Type": "application/json"},
        body:JSON.stringify(chunk),
    });
    if(!response.ok){
        console.error("Expo push failed:", response.status, await response.text());
    }
}

}