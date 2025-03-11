import {getCurrentUser} from "aws-amplify/auth";
import {fetchData, pushData} from "./remote";
import {loadData, saveData} from "./local";

export async function getData(event) {
    // Try to load from the remote server. If that fails, try to load from indexeddb.
    const currentUser = await getCurrentUser();
    let data;
    try {
        // TODO: Move into background sync to refresh local data
        // data = await fetchData(currentUser);
    } catch (e) {
        console.error("Failed to load data from remote server", e);
    }

    if (!data) {
        data = await loadData();
    }

    return data;
    /*
    loadData().then(data => {
        console.log("Loaded data")
        event.ports[0].postMessage(data);
        if (true) {
            data = JSON.parse(data);
            let numberTasksDue = 0;
            for (const list of Object.values(data?.tasks?.taskLists || {})) {
                numberTasksDue += list.tasks.length;
            }

            const expiredItems = (data?.kitchen?.pantry?.items || []).filter(item => {
                const remainingTime = (item.expiration ? moment(item.expiration).diff(moment(), "days") : 9999);
                return remainingTime < 0;
            }).length;
            const expiringItems = (data?.kitchen?.pantry?.items || []).filter(item => {
                const remainingTime = (item.expiration ? moment(item.expiration).diff(moment(), "days") : 9999);
                return remainingTime <= 3 && remainingTime >= 0;
            }).length;

            console.log("Sending notifications")
            self.clients.matchAll({
                includeUncontrolled: true
            }).then((clients) => {
                console.log("Notifying " + clients.length + " clients");
                if (numberTasksDue > 0) {
                    // eslint-disable-next-line no-undef
                    clients.forEach(client => {
                        client.postMessage({
                            type: "ALERT",
                            payload: JSON.stringify({
                                message: `${numberTasksDue} task(s) due today.`,
                                type: "warning"
                            }),
                        })
                    });
                }

                if (expiredItems > 0) {
                    clients.forEach(client => {
                        client.postMessage({
                            type: "ALERT",
                            payload: JSON.stringify({
                                message: `${expiredItems} pantry items(s) have expired!`,
                                type: "error"
                            }),
                        })
                    });
                }

                if (expiringItems > 0) {
                    // eslint-disable-next-line no-undef
                    clients.forEach(client => {
                        client.postMessage({
                            type: "ALERT",
                            payload: JSON.stringify({
                                message: `${expiringItems} pantry items(s) expiring soon.`,
                                type: "warning"
                            }),
                        });
                    })
                }
            });
        }
    }, err => console.error(err));
*/
}

export async function putData(event) {
    const currentUser = await getCurrentUser();
    const payload = JSON.parse(event.data.state);

    await saveData(currentUser, payload);
}

