import {combineReducers, configureStore} from "@reduxjs/toolkit";
import TaskStateConfiguration from "../tasks/state/TaskStateConfiguration";
import {TutorialStateConfiguration} from "../tutorials/state/TutorialStateConfiguration";
import KitchenStateConfiguration from "../kitchen/state/KitchenStateConfiguration";
import AlertsStateConfiguration from "../alerts/configuration/AlertsStateConfiguration";
import {getActions as GetAlertsActions} from "../alerts/configuration/AlertsStateConfiguration";
import {ServiceWorkerContext} from "../service-worker/ServiceWorkerContext";
import {put, takeLeading, select} from "redux-saga/effects";
import * as _ from "lodash";
import createSagaMiddleware from "redux-saga";

// TODO: Create a default "to-do" task list
// TODO: Implement remote persistence.
// TODO: Implement user tutorials.
// TODO: Middleware for intercepting dangerous actions.
const combinedReducer = combineReducers({
    tasks: TaskStateConfiguration().reducer,
    tutorials: TutorialStateConfiguration().reducer,
    kitchen: KitchenStateConfiguration(),
    alerts: AlertsStateConfiguration(),
    user: (state = null, action) => {
        if (action.type === "UNAUTHENTICATED") {
            return null;
        } else if (action.type === "AUTHENTICATED") {
            return action.data;
        } else {
            return state ? state : {
                user: null,
                welcomed: false
            };
        }
    }
});

const saga = createSagaMiddleware()

function* welcomeUser(action) {
    let welcomed = false
    yield takeLeading("AUTHENTICATED", function* (action) {
        const user = yield select(state => state.user);
        if(!welcomed) {
            welcomed = true
            yield put(
                GetAlertsActions().Alert({message: `Welcome ${user.signInDetails.loginId}`})
            )
        }
    })
}

export const store = configureStore({
    reducer: (state, action) => {
        switch (action.type) {
            case "WELCOME":
                return {
                    ...state, user: {
                        ...state.user,
                        welcomed: true
                    }
                }
            case "AUTHENTICATED":
                return {...state, user: action.data};
            case "UNAUTHENTICATED":
                return {...state, user: null};
            case "LOAD_STATE":
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

saga.run(welcomeUser)

// TODO: On load, show notification of tasks that are due today.
store.subscribe(() => {
    // TODO: Save is being triggered multiple times, move into saga to prevent multiple saves.
    console.log("Persisting state after store update");
    const wb = ServiceWorkerContext.Provider._context._currentValue;
    wb.active.then(x => {
        const state = store.getState()
        console.log("save", state.alerts.active)
        wb.messageSW({
            type: 'SAVE_STATE', state: JSON.stringify(_.omit(state, ["alerts"]))
        })
    });
});