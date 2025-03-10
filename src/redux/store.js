import {combineReducers, configureStore} from "@reduxjs/toolkit";
import TaskStateConfiguration from "../tasks/state/TaskStateConfiguration";
import {TutorialStateConfiguration} from "../tutorials/state/TutorialStateConfiguration";
import KitchenStateConfiguration from "../kitchen/state/KitchenStateConfiguration";
import AlertsStateConfiguration, {Alert} from "../alerts/configuration/AlertsStateConfiguration";
import {ServiceWorkerContext} from "../service-worker/ServiceWorkerContext";
import {put, takeLeading, select, call, spawn, debounce, takeLatest} from "redux-saga/effects";
import * as _ from "lodash";
import createSagaMiddleware from "redux-saga";

// TODO: Create a default "to-do" task list
// TODO: Implement remote persistence.
// TODO: Implement user tutorials.
// TODO: Middleware for intercepting dangerous actions.
const combinedReducer = combineReducers({
    householdTasks: TaskStateConfiguration,
    tutorials: TutorialStateConfiguration().reducer,
    kitchen: KitchenStateConfiguration(),
    alerts: AlertsStateConfiguration,
    user: (state = null, action) => {
        if (action.type === "UNAUTHENTICATED") {
            return {
                user: null,
                welcomed: false
            };
        } else if (action.type === "AUTHENTICATED") {
            return {...state, user: action.data};
        } else {
            return state ? state : {
                user: null,
                welcomed: false
            };
        }
    }
});

const saga = createSagaMiddleware()

function* welcomeUser() {
    let welcomed = false
    yield takeLeading("AUTHENTICATED", function* (action) {
        if (!welcomed) {
            const user = yield select(state => state.user);
            welcomed = true
            yield put(
                Alert({message: `Welcome ${user.user.signInDetails.loginId}`})
            )
        }
    })
}

function* loadOnAuthenticate() {
    yield takeLeading("AUTHENTICATED", function* (action) {
        const sw = yield call(() => ServiceWorkerContext.Provider._context._currentValue);
        const loaded = yield call(() => sw.messageSW({
            type: "LOAD_STATE"
        }));
        yield put({
            type: "LOADED_STATE",
            data: loaded.data,
            noSave: true
        });
    })
}

function* persistOnChange() {
    yield debounce(500, action => !action.noSave, function* (action) {
        yield call(async () => {
            // FIXME: This is a hack to get the service worker context.
            const wb = ServiceWorkerContext.Provider._context._currentValue;
            const state = store.getState()
            return await wb.messageSW({
                type: 'SAVE_STATE',
                noSave: true,
                state: JSON.stringify(_.omit(state, ["alerts", "user", "tutorials"])) // TODO: Save tutorials attached to users, not households.
            })
        })
    })
}

export const store = configureStore({
    reducer: (state, action) => {
        switch (action.type) {
            case "LOADED_STATE":
                console.log("Setting loaded state");
                if (action.data) {
                    return {...state, ...JSON.parse(action.data)};
                }
            default:
                return combinedReducer(state, action);
        }
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat([saga])
    }
});

saga.run(function*() {
    yield spawn(welcomeUser)
    yield spawn(loadOnAuthenticate)
    yield spawn(persistOnChange)
});

// // TODO: On load, show notification of tasks that are due today.
// store.subscribe(() => {
//     // TODO: Save is being triggered multiple times, move into saga to prevent multiple saves.
//     console.log("Persisting state after store update");
//     const wb = ServiceWorkerContext.Provider._context._currentValue;
//     wb.active.then(x => {
//         console.log("Web worker active, sending state");
//         const state = store.getState()
//         wb.messageSW({
//             type: 'SAVE_STATE', state: JSON.stringify(_.omit(state, ["alerts", "user", "tutorials"])) // TODO: Save tutorials attached to users, not households.
//         })
//     });
// });