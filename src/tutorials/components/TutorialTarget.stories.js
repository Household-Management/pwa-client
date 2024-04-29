import React, {Fragment, useState, useRef} from "react";
import {
    TutorialPopper as TutorialPopperComponent,
    ConnectedTutorialPopper as Tutorials
} from "./TutorialPopper";
import {Paper} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Tutorial from "../model/Tutorial";
import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import {TutorialStateConfiguration, getActions} from "../state/TutorialStateConfiguration";
import * as _ from "lodash";

export default {}

const MockStore = initialState => configureStore({
    reducer: {
        tutorials: TutorialStateConfiguration(initialState).reducer
    }
});

export const TutorialPopper = {
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
            <TutorialPopperComponent activeTutorial={activeTutorial}>
                <Paper sx={{padding: 1}}>
                    {activeTutorial?.message}
                </Paper>
            </TutorialPopperComponent>
            {Object.values(args.tutorials).map(t => {
                const tut = t;
                return <button id={t.completionMatcher.target.substring(1)} onClick={ev => {
                    changeActiveTutorial(activeTutorial === tut ? null : tut);
                }}
                               style={{position: "relative"}}>{activeTutorial !== tut ? `Start Tutorial ${tut.id}` : `End Tutorial ${tut.id}`}</button>
            })}
        </Fragment>
    }
}

export const CompleteOnButtonClick = {
    args: {
        tutorials: {
            "tutorial-1": {
                ...new Tutorial("tutorial-1",
                    "Tutorials can be completed when something is clicked, like a button",
                    ["#tutorial-button-1"],
                    {
                        type: "navigate"
                    },
                    {
                        type: "click",
                        target: "#tutorial-button-1"
                    })
            },
            "tutorial-2": {
                ...new Tutorial("tutorial-2", "Tutorials can be completed when something is entered into an input", ["#tutorial-button-2"], {
                    type: "change",
                    target: "#tutorial-input-2"
                })
            },
        },
    },
    decorators: [(story, opts) => {
        const store = MockStore({
            tutorials: opts.args.tutorials,
            activeTutorial: null
        });
        opts.args.getState = () => store.getState();
        opts.args.dispatch = store.dispatch;
        return <Provider store={store}>{story()}</Provider>
    }],
    render: (args) => {
        return <Fragment>
            <Tutorials>

            </Tutorials>
            <button id="tutorial-button-1" onClick={ev => {
                if (!args.getState().tutorials.activeTutorial) {
                    args.dispatch(getActions().StartTutorial("tutorial-1"))
                }
            }}
                    style={{position: "relative"}}>{args.getState().tutorials.activeTutorial !== 1 ? "Start Tutorial 1" : "End Tutorial 1"}</button>
            <input id="tutorial-input-1"/>
        </Fragment>
    }
}