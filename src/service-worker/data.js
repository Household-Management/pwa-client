import {getCurrentUser} from "aws-amplify/auth";

export async function loadData(event) {
    const currentUser = await getCurrentUser();
    dataClient.models.Kitchen.get({
        owner: currentUser.userId
    })
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

export async function saveData(event) {
    console.log("Doing save")
    const {payload} = event.data;
    return dbOpen().then(db => {
        console.log("Starting save transaction")
        const tx = db.transaction("state", "readwrite");
        tx.oncomplete = (() => {
            console.log("Save transaction done")
        });
        tx.onabort = (() => {
            console.log("Save transaction aborted")
        });
        tx.onerror = (() => {
            console.log("Save transaction error")
        });
        const store = tx.objectStore("state");
        console.log("Putting into db");
        store.put({id: 1, state: payload});
    }, err => console.error(err.message));
}

// function loadData() {
//     return dbOpen().then(async (db) => {
//         console.log("Starting load transaction")
//         const tx = db.transaction("state", "readonly");
//         tx.oncomplete = (() => {
//             console.log("Load transaction done")
//         });
//         tx.onabort = (() => {
//             console.log("Load transaction aborted")
//         });
//         tx.onerror = (() => {
//             console.log("Load transaction error")
//         });
//         console.log("Reading from db");
//         const store = tx.objectStore("state");
//         const out = await new Promise((resolve, reject) => {
//             const req = store.get(1);
//             req.onsuccess = ev => {
//                 console.log("Read data from db");
//                 resolve(ev.target.result?.state);
//             }
//             req.onerror = ev => reject(ev);
//         });
//         return out;
//     }, (err) => {
//         console.error(err);
//     });
// }

function dbOpen() {
    console.log("Opening db...")
    return new Promise((resolve, reject) => {

        const connection = indexedDB.open("state", 1);
        connection.onsuccess = ev => {
            console.log("Opened database");
            resolve(ev.target.result);
        }
        connection.onerror = ev => reject(ev);

        connection.onupgradeneeded = ev => {
            console.log("Upgrading database");
            const db = ev.target.result;
            const objectStore = db.createObjectStore("state", {keyPath: "id"});

            objectStore.transaction.oncomplete = ev => {
            }
        }
    });

}