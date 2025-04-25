import {combineReducers, combineSlices, configureStore} from "@reduxjs/toolkit";
import TaskStateConfiguration from "../tasks/state/TaskStateConfiguration";
import { TutorialStateConfiguration } from "../tutorials/state/TutorialStateConfiguration";
import AlertsStateConfiguration, {Alert} from "../alerts/configuration/AlertsStateConfiguration";
import {put, takeLeading, select, call, spawn, debounce, take, takeEvery} from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import PantryStateConfiguration from "../kitchen/pantry/state/PantryStateConfiguration";
import GroceriesStateConfiguration from "../kitchen/groceries/state/GroceriesStateConfiguration";
import RecipesStateConfiguration from "../kitchen/recipes/state/RecipesStateConfiguration";

import {AddGroceryList } from "../kitchen/groceries/state/GroceriesStateConfiguration";
import {CreateList, Persisters as TaskPersisters} from "../tasks/state/TaskStateConfiguration"

import {generateClient} from "aws-amplify/data";

const client = generateClient();

// TODO: Create a default "to-do" task list
// TODO: Implement remote persistence.
// TODO: Implement user tutorials.
// TODO: Middleware for intercepting dangerous actions.
const combinedReducer = combineReducers({
    household: combineSlices({
        id: (state, action) => {

            if(action.type === "LOADED_STATE") {
                return action.payload.id;
            }

            return state ? state : null;
        },
        adminGroup: (state, action) => {
            if(action.type === "LOADED_STATE") {
                return action.payload.adminGroup;
            }

            return state ? state : null;
        },
        membersGroup: (state, action) => {
            if(action.type === "LOADED_STATE") {
                return action.payload.membersGroup;
            }

            return state ? state : null;
        },
        householdTasks: TaskStateConfiguration.reducer,
        tutorials: TutorialStateConfiguration.reducer,
        kitchen: combineSlices({
            pantry: PantryStateConfiguration,
            groceries: GroceriesStateConfiguration,
            recipes: RecipesStateConfiguration
        }),
    }),
    alerts: AlertsStateConfiguration,
    user: (state = null, action) => {
        if (action.type === "UNAUTHENTICATED") {
            return {
                user: null,
                welcomed: false
            };
        } else if (action.type === "AUTHENTICATED") {
            if (isValidUser(action.payload)) {
                return {...state, ...action.payload};
            } else {
                throw new Error("Invalid user payload: " +  JSON.stringify(action.payload));
            }
        } else {
            return state ? state : {
                welcomed: false
            };
        }
    }
});

function isValidUser(user) {
    return user && typeof user.loginId === "string";
}

const saga = createSagaMiddleware()

function* welcomeUser() {
    let welcomed = false
    yield takeLeading("AUTHENTICATED", function* (action) {
        if (!welcomed) {
            const user = yield select(state => state.user);
            welcomed = true
            yield put(
                Alert({message: `Welcome ${user.loginId}`})
            )
        }
    })
    yield takeLeading("UNAUTHENTICATED", function* (action) {
        welcomed = false
    });
}

function* persistOnChange() {
    yield spawn(function* () {
        yield takeEvery((action) => {
            return action?.meta?.persister;
        }, function* (action) {
            const state = yield select(state => state)
            const persistenceFunction = action.meta.persister;
            persistenceFunction(client, state, action);
        });
    })
}

export const store = configureStore({
    reducer: (state, action) => {
        switch (action.type) {
            default:
                return combinedReducer(state, action);
        }
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat([saga])
    }
});

saga.run(function* () {
    yield spawn(welcomeUser)
    // yield spawn(loadOnAuthenticate)
    // yield spawn(loadOnSelectHousehold)
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