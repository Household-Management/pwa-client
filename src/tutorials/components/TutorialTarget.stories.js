import React, {Fragment, useState, useRef} from "react";
import {TutorialPopper} from "./TutorialPopper";
import {Paper} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

export default {
    args: {
        highlightTarget: true
    }
}

export const TutorialTarget = {
    render: (args) => {
        const [target, setTarget] = useState(null);
        const [activeTutorial, setActiveTutorial] = useState(null);
        const changeActiveTutorial = (id) => {
            setActiveTutorial(id);
        }

        return <Fragment>
            <TutorialPopper open={activeTutorial !== null} targetElement={target} highlightTarget={args.highlightTarget} >
                <Paper sx={{padding: 1}}>
                    Hello World
                </Paper>
            </TutorialPopper>
            <button onClick={ev => {
                changeActiveTutorial(activeTutorial === 1 ? null : 1);
                setTarget(ev.target);
            }} style={{position: "relative"}}>{activeTutorial !== 1 ? "Start Tutorial 1" : "End Tutorial 1"}</button>
            <button onClick={ev => {
                changeActiveTutorial(activeTutorial === 2 ? null : 2);
                setTarget(ev.target);
            }} style={{position: "relative"}}>{activeTutorial !== 2 ? "Start Tutorial 2" : "End Tutorial 2"}</button>
            <button onClick={ev => {
                changeActiveTutorial(activeTutorial === 3 ? null : 3)
                setTarget(ev.target);
            }} style={{position: "relative"}}>{activeTutorial !== 3 ? "Start Tutorial 3" : "End Tutorial 3"}</button>
        </Fragment>
    }
}

export const TutorialJsxTarget = {
    render: (args) => {
        const [target, setTarget] = useState(null);
        const [activeTutorial, setActiveTutorial] = useState(null);
        const paper = useRef(null);
        const changeActiveTutorial = (id) => {
            setActiveTutorial(id);
        }

        return <Fragment>
            <TutorialPopper open={activeTutorial !== null} targetElement={target} highlightTarget={args.highlightTarget}>
                <Paper sx={{padding: 1}}>
                    Hello World
                </Paper>
            </TutorialPopper>
            <button onClick={ev => {
                changeActiveTutorial(activeTutorial === 1 ? null : 1);
                setTarget(paper.current);
            }} style={{position: "relative"}}>{activeTutorial !== 1 ? "Start Tutorial 1" : "End Tutorial 1"}</button>
            <Accordion ref={paper} style={{position: "relative"}}>
                <AccordionSummary>
                    Summary
                </AccordionSummary>
                <AccordionDetails>
                    Body
                </AccordionDetails>
            </Accordion>
        </Fragment>
    }
}