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

export function loadData(currentUser) {
    return dbOpen().then(async (db) => {
        console.log("Starting load transaction")
        const tx = db.transaction("state", "readonly");
        tx.oncomplete = (() => {
            console.log("Load transaction done")
        });
        tx.onabort = (() => {
            console.log("Load transaction aborted")
        });
        tx.onerror = (() => {
            console.log("Load transaction error")
        });
        console.log("Reading from db");
        const store = tx.objectStore("state");
        return await new Promise((resolve, reject) => {
            const req = store.get(1);
            req.onsuccess = ev => {
                console.log("Read data from db");
                resolve(ev.target.result?.state);
            }
            req.onerror = ev => reject(ev);
        });
    }, (err) => {
        console.error(err);
    });
}

export function saveData(currentUser, payload) {
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
