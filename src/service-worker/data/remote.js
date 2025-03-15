import {generateClient} from "aws-amplify/data";

const dataClient = generateClient({
    authMode: "userPool"
});

export async function fetchData(currentUser) {
    return dataClient.models.Household.get({
        owner: currentUser.userId
    });
}
export async function  pushData(currentUser, data) {
    try {
        if(data.id) {
            return await dataClient.models.Household.update(data);
        } else {
            return await dataClient.models.Household.create(data);
        }

    } catch(e) {
        console.error(e);
    }
}