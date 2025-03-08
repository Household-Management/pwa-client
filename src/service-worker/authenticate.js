import {signIn, signOut} from "@aws-amplify/auth";
import {getCurrentUser} from "aws-amplify/auth";

export default async function (event) {
    const {data} = event;
    if (data.payload.useExisting) {
        try {
            // It really sucks that Amplify throws to represent an unauthenticated user, but *shrug*.+
            const currentUser = await getCurrentUser();
            event.ports[0].postMessage({
                type: "AUTHENTICATED",
                payload: currentUser
            })
        } catch (e) {
            console.error("No existing user", e);
        }
    } else {
        await signOut()
        await signIn({
            username: data.payload.username,
            password: data.payload.password
        });
        const currentUser = await getCurrentUser();
        console.log("Signed in", currentUser);
        event.ports[0].postMessage({
            type: "AUTHENTICATED",
            payload: currentUser
        }, err => {
            console.error(err);
        });
    }

}