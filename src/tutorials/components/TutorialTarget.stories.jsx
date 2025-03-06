import React, {Fragment, useState, useRef} from "react";
import {
    TutorialPopper as TutorialPopperComponent,
    ConnectedTutorialPopper as Tutorials
} from "./TutorialPopper";
import {Paper} from "@mui/material";
import createSagaMiddleware from "redux-saga";
import Tutorial from "../model/Tutorial";
import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import {TutorialStateConfiguration, getActions, TriggerReadyTutorialSaga} from "../state/TutorialStateConfiguration";

export default {
    decorators: [(story, opts) => {
        const sagaMiddleware = createSagaMiddleware();
        const store = configureStore({
            reducer: {
                tutorials: TutorialStateConfiguration({
                    tutorials: opts.args.tutorials,
                    activeTutorial: null
                }).reducer
            },
            middleware: getDefaultMiddleware => {
                return getDefaultMiddleware().concat([sagaMiddleware])
            }
        });

        sagaMiddleware.run(TriggerReadyTutorialSaga);
        opts.args.getState = () => store.getState();
        opts.args.dispatch = store.dispatch;
        return <Provider store={store}>{story()}</Provider>
    }],
}

export const TutorialPoppers = {
    args: {
        tutorials: {
            "tutorial-1": new Tutorial("tutorial-1", "This is tutorial 1", ["#tutorial-button-1"], {
                type: "click",
                target: "#tutorial-button-1"
            }),
            "tutorial-2": new Tutorial("tutorial-2", "This is tutorial 2", ["#tutorial-button-2"], {
                type: "click",
                target: "#tutorial-button-2"
            }),
            "tutorial-3": new Tutorial("tutorial-3", "This is tutorial 3", ["#tutorial-button-3"], {
                type: "click",
                target: "#tutorial-button-3"
            }),
        }
    },
    render: (args) => {
        const [activeTutorial, setActiveTutorial] = useState(null);
        const changeActiveTutorial = (tutorial) => {
            setActiveTutorial(tutorial);
        }

        return <Fragment>
            <TutorialPopperComponent activeTutorial={activeTutorial} tutorials={args.tutorials}
                                     dispatch={args.dispatch}>
                <Paper sx={{padding: 1}}>
                    {activeTutorial?.message}
                </Paper>
            </TutorialPopperComponent>
            {Object.values(args.tutorials).map(t => {
                const tut = t;
                return <button id={tut.startTriggers[0].target.substring(1)} onClick={ev => {
                    changeActiveTutorial(activeTutorial === tut ? null : tut);
                }}
                               style={{position: "relative"}}>{activeTutorial !== tut ? `Start Tutorial ${tut.id}` : `End Tutorial ${tut.id}`}</button>
            })}
        </Fragment>
    }
}

export const ButtonTutorials = {
    args: {
        tutorials: {
            "tutorial-1": {
                ...new Tutorial("tutorial-1",
                    "Tutorials can be completed when a button is clicked. Click the button to complete this tutorial.",
                    ["#tutorial-button-1"],
                    {
                        type: "auto"
                    },
                    {
                        type: "click",
                        target: "#tutorial-button-1"
                    })
            },
            "tutorial-2": {
                ...new Tutorial("tutorial-2",
                    "Now you started a tutorial by clicking.",
                    ["#tutorial-button-2"],
                    {
                        type: "click",
                        target: "#tutorial-button-2"
                    },
                    [{
                        type: "click",
                        target: "#tutorial-button-2"
                    },
                        {
                            type: "tutorial-complete",
                            target: "tutorial-1"
                        }])
            }
        },
    },
    render: (args) => {
        return <Fragment>
            <Tutorials/>
            <button id="tutorial-button-1"
                    style={{position: "relative"}}>End Tutorial 1
            </button>
            <button id="tutorial-button-2" style={{position: "relative"}}>
                Start Tutorial 2
            </button>
        </Fragment>
    }
}

export const InputTutorials = {
    args: {
        tutorials: {
            "tutorial-1": {
                ...new Tutorial("tutorial-1",
                    "Click on the input",
                    ["#tutorial-input-1"],
                    {
                        type: "auto"
                    },
                    {
                        type: "click",
                        target: "#tutorial-input-1"
                    })
            },
            "tutorial-2": {
                ...new Tutorial("tutorial-2",
                    "Now type into this input to complete the next tutorial.",
                    ["#tutorial-input-1"],
                    [{
                        type: "tutorial-complete",
                        target: "tutorial-1"
                    }],
                    {
                        type: "input",
                        target: "#tutorial-input-1"
                    })
            }
        },
    },
    render: (args) => {
        return <Fragment>
            <Tutorials/>
            <input id="tutorial-input-1" style={{position: "relative"}}></input>
        </Fragment>
    }
}