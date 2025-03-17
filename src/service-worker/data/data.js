import {getCurrentUser} from "aws-amplify/auth";
import {loadData, saveData} from "./local";
import {fetchData, pushData} from "./remote";


export async function getData(event, options) {
    const currentUser = await getCurrentUser();
    let data;
    if (!options?.remoteOnly) {
        data = await loadData();
    }

    try {
        if(!options?.localOnly && !data) {
            data = await fetchData(currentUser);
        }
    } catch (e) {
        console.error("Failed to load data from remote server", e);
    }

    return data;
}

export async function putData(event, options) {
    const currentUser = await getCurrentUser();
    const payload = JSON.parse(event.data.state);

    if(!options?.remoteOnly) {
        await saveData(currentUser, payload);
    }

    if (!options?.localOnly) { {
        await pushData(currentUser, payload);}
    }
}

