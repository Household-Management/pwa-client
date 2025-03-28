import {combineReducers, combineSlices, configureStore} from "@reduxjs/toolkit";
import TaskStateConfiguration from "../tasks/state/TaskStateConfiguration";
import TutorialStateConfiguration from "../tutorials/state/TutorialStateConfiguration";
import AlertsStateConfiguration, {Alert} from "../alerts/configuration/AlertsStateConfiguration";
import {put, takeLeading, select, call, spawn, debounce, take, takeEvery} from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import PantryStateConfiguration from "../kitchen/pantry/state/PantryStateConfiguration";
import GroceriesStateConfiguration, {Persisters} from "../kitchen/groceries/state/GroceriesStateConfiguration";
import RecipesStateConfiguration from "../kitchen/recipes/state/RecipesStateConfiguration";

import { AddGroceryList, Persisters as GroceryPersisters } from "../kitchen/groceries/state/GroceriesStateConfiguration";
import { CreateList, Persisters as TaskPersisters} from "../tasks/state/TaskStateConfiguration"

import { generateClient } from "aws-amplify/data";

const client = generateClient();

// TODO: Create a default "to-do" task list
// TODO: Implement remote persistence.
// TODO: Implement user tutorials.
// TODO: Middleware for intercepting dangerous actions.
const combinedReducer = combineReducers({
    household: combineSlices({
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
            return {...state, user: action.payload};
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
    yield takeLeading("UNAUTHENTICATED", function* (action) {
        welcomed = false
    });
}

function* loadOnAuthenticate() {
    yield takeLeading("AUTHENTICATED", function* (action) {
        // const loaded = yield call(async () => {
        //     return await client.models.Household.get();
        // })
        // const sw = yield call(() => ServiceWorkerContext.Provider._context._currentValue);
        // const loaded = yield call(() => sw.messageSW({
        //     type: "LOAD_STATE"
        // }));
        // yield put({
        //     type: "LOADED_STATE",
        //     payload: loaded.payload,
        //     noSave: true
        // });
    })
}

function* persistOnChange() {
    yield spawn(function* () {
        yield takeEvery(AddGroceryList.type, function* (action) {
            const household = yield select(state => state.household);
            yield call(() => GroceryPersisters[AddGroceryList.type](client, {...action.payload, householdId: household.id}));
        });
    })
    yield spawn(function* () {
        yield takeEvery(CreateList.type, function* (action) {
            const household = yield select(state => state.household);
            yield call(() => TaskPersisters[CreateList.type](client, {...action.payload, householdId: household.id}));
        });
    });
}

function* loadOnSelectHousehold() {

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

saga.run(function*() {
    yield spawn(welcomeUser)
    yield spawn(loadOnAuthenticate)
    yield spawn(loadOnSelectHousehold)
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