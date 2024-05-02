import {createSlice, createAction} from "@reduxjs/toolkit";
import Tutorial from "../model/Tutorial";
import {takeLeading, takeEvery, put, select} from 'redux-saga/effects';

let slice = undefined;

// TODO: Validate initial state
export function TutorialStateConfiguration(initialState) {
    slice = createSlice({
        name: "tasks",
        initialState: initialState ? initialState : {
            tutorials: {
                "create-list": {
                    ...new Tutorial("create-list", "#To create new lists of tasks, click here", ["#create-list"],
                        {type: "click", target: "#create-list"})
                },
            }
        },
        reducers: {
            HandleStartTutorial(state, action) {
                if (state.tutorials[action.payload].status === 0 && !state.activeTutorial) {
                    state.tutorials[action.payload].status = 1;
                    state.activeTutorial = state.tutorials[action.payload];
                }
                return state;
            },
            HandleCompleteTutorial(state, action) {
                if (state.activeTutorial && state.activeTutorial.id === action.payload) {
                    state.tutorials[state.activeTutorial.id].status = 2;
                    state.activeTutorial = null;
                }

                return state;
            },
            HandleFireTriggers(state, action) {
                action.payload.forEach((trigger) => {
                    const affectedTutorials = GetTutorialsWaitingForTrigger(trigger)(state);
                    affectedTutorials.forEach(tutorial => {
                        tutorial.startTriggers.concat(tutorial.completionTriggers).filter(t => !t.isCompleted)
                            .forEach(tutorialTrigger => {
                                if (tutorialTrigger.type == trigger.type && tutorialTrigger.target === trigger.target) {
                                    tutorialTrigger.isCompleted = true;
                                }
                            });
                    });
                });
                return state;
            }
        }
    });
    slice.actions["FireTriggers"] = createAction("tasks/FireTriggers");
    slice.actions["StartTutorial"] = createAction("tasks/StartTutorial");
    slice.actions["CompleteTutorial"] = createAction("tasks/CompleteTutorial");
    return slice;
}

export function* TriggerReadyTutorialSaga() {
    yield takeLeading("tasks/StartTutorial", function* (action) {
        yield put(slice.actions.HandleStartTutorial(action.payload));
    });
    yield takeEvery("tasks/FireTriggers", function* (x) {
        const tutorialsBeforeUpdate = yield select(state => state.tutorials.tutorials);
        yield put(slice.actions.HandleFireTriggers(x.payload));
        const tutorialsAfterUpdate = yield select(state => state.tutorials.tutorials);
        const diff = Object.keys(tutorialsAfterUpdate)
            .filter(key => tutorialsAfterUpdate[key].completionTriggers !== tutorialsBeforeUpdate[key].completionTriggers || tutorialsAfterUpdate[key].startTriggers !== tutorialsBeforeUpdate[key].startTriggers)
        for (let tutorial of diff.map(id => tutorialsAfterUpdate[id])) {
            if (tutorial.status === 0 && tutorial.startTriggers.every(trigger => trigger.isCompleted)) {
                yield put(slice.actions.StartTutorial(tutorial.id));
            }
            if (tutorial.status === 1 && tutorial.completionTriggers.every(trigger => trigger.isCompleted)) {
                yield put(slice.actions.CompleteTutorial(tutorial.id));
            }
        }
    });
    yield takeEvery("tasks/CompleteTutorial", function* (x) {
        yield put(slice.actions.HandleCompleteTutorial(x.payload));
        yield put(slice.actions.FireTriggers([{type: "tutorial-complete", target: x.payload}]));
    });
    yield put(slice.actions.FireTriggers([{type: "auto"}]));
}

// FIXME: Cache this output
// TODO: Normalize triggers so that duplicates are treated the same.
function GetTutorialsWaitingForTrigger(trigger) {
    return state => {
        return Object.values(state.tutorials).filter(tutorial => {
            return tutorial.status !== 2 && tutorial.startTriggers.concat(tutorial.completionTriggers).some(tutorialTrigger =>
                !tutorialTrigger.isCompleted && tutorialTrigger.type == trigger.type && tutorialTrigger.target === trigger.target
            );
        });
    }
}

// TODO: Make property of config function?
export function getActions() {
    return slice.actions;
}

export function getSelectors() {
    return slice.selectors;
}