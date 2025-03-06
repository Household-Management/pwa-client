import {Box, Paper, Popper} from "@mui/material";
import React, {Fragment, useRef, useState, useMemo, useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getActions} from "../state/TutorialStateConfiguration";

export function TutorialPopper({
                                   activeTutorial,
                                   tutorials,
                                   sx,
                                   children,
                                   dispatch
                               }) {
    const matcher = useRef(null)
    const {targetElements: targetElementSelectors, highlightTarget = true, completionMatcher} = activeTutorial || {};
    matcher.current = completionMatcher;
    const lastTargets = useRef(null);
    const [rerender, setRerender] = useState(false);
    let targetElements = useMemo(() => {
        const selector = !targetElementSelectors || typeof targetElementSelectors === "string" ? targetElementSelectors : targetElementSelectors.join(", ");
        // FIXME: Make resilient for bad selectors, as querySelector can throw.
        if (typeof (targetElementSelectors) === "string") {
            return document.querySelectorAll(selector);
        } else if (Array.isArray(targetElementSelectors)) {
            return document.querySelectorAll(selector);
        }
    }, [targetElementSelectors, activeTutorial != null, rerender]);

    // Organize tutorial triggers by event that can trigger them
    const tutorialsByEvent = useRef(null);
    tutorialsByEvent.current = useMemo(() => {
        return Object.values(tutorials).reduce((acc, tutorial) => {
            const matchers = tutorial.startTriggers.concat(tutorial.completionTriggers)
                .filter(x => !x.triggered);
            matchers.forEach(matcher => {
                if (!acc[matcher.type]) {
                    acc[matcher.type] = [];
                }
                acc[matcher.type].push(tutorial);
            });
            return acc;
        }, {});
    }, [tutorials]);


    // Subscribe to events
    // When event triggers, fire all the matching triggers
    useEffect(() => {
        const handler = handleEvents(tutorialsByEvent, dispatch);
        document.body.addEventListener("click", handler);
        document.body.addEventListener("tutorial-complete", handler);
        document.body.addEventListener("input", handler);
        if (document.readyState === "complete") {
            handleEvents(tutorialsByEvent, dispatch)({type: "auto"});
            setRerender(true);
        }
        // FIXME: Unsubscribe when called multiple times or remove need of multiple calls.
    }, []);


    if (activeTutorial !== null && targetElements) {
        if (lastTargets.current) {
            lastTargets.current.forEach(el => el.style.zIndex = 0);
        }
        targetElements.forEach(el => {
            if(el.style.position === "static") {
                console.warn("Tutorial target element has static position. This will cause it to now show in front of the dimmer.");
            }
            el.style.zIndex = highlightTarget ? 100 : 0
        });
        lastTargets.current = targetElements;
    }

    return <Fragment>
        <Box sx={{
            zIndex: 1,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#00000090",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            visibility: activeTutorial != undefined ? "visible" : "hidden",
            ...sx
        }}/>
        <Popper style={{zIndex: 1}} anchorEl={targetElements && targetElements[0]} open={activeTutorial != undefined}>
            {children || <Paper sx={{padding: 1}}>
                {activeTutorial?.message}
            </Paper>}
        </Popper>
    </Fragment>
}

export const ConnectedTutorialPopper = connect((state, ownProps) => {
    return {
        activeTutorial: state.tutorials.activeTutorial,
        tutorials: state.tutorials.tutorials,
        ...ownProps
    }
})(TutorialPopper);

// FIXME: Correct these
TutorialPopper.propTypes = {
    targetElementSelectors: PropTypes.arrayOf(PropTypes.string),
    open: PropTypes.bool.isRequired,
    children: PropTypes.array.isRequired,
    highlightTarget: PropTypes.bool
}

function handleEvents(tutorialsByEventHolder, dispatch) {
    return ev => {
        const eventType = ev.type;
        const tutorialsByEvent = tutorialsByEventHolder.current;
        const affectedTutorials = tutorialsByEvent[eventType];
        if (affectedTutorials) {
            // FIXME: Precalculate target checks
            affectedTutorials
                .filter(t => t.status !== 2)
                .forEach(tutorial => {
                const triggers = tutorial.startTriggers.concat(tutorial.completionTriggers)
                    .filter(t => !t.isCompleted);
                const triggersToFire = [];
                triggers.forEach(trigger => {
                    if (trigger.type === "auto") {
                        triggersToFire.push(trigger);
                    } else if (trigger.type === eventType) {
                        if (!trigger.target || ev.target.matches(trigger.target) || trigger.target === ev.detail) {
                            triggersToFire.push(trigger);
                        }
                    }
                });
                if (triggersToFire.length > 0) {
                    dispatch(getActions().FireTriggers(triggersToFire));
                }
            });
        }
    }
}

function checkForTriggerCompletion(tutorials, dispatch) {
    return () => {
        // Organize tutorials by event that can trigger them
        const tutorialsByEvent = Object.values(tutorials)
            .filter(tutorial => !tutorial.completed)
            .reduce((acc, tutorial) => {
                const matchers = (Array.isArray(tutorial.startTrigger) ? tutorial.startTrigger : [tutorial.startTrigger])
                    .concat(Array.isArray(tutorial.completionTrigger) ? tutorial.completionTrigger : [tutorial.completionTrigger])
                    .filter(x => x);
                matchers.forEach(matcher => {
                    if (!acc[matcher.type]) {
                        acc[matcher.type] = [];
                    }
                    acc[matcher.type].push(tutorial);
                });
                return acc;
            }, {});
        const onEventReceived = type => ev => {
            const tutorialsForEvent = tutorialsByEvent[type];
            if (tutorialsForEvent) {
                let tutorialsToUpdate = [];
                tutorialsForEvent.forEach(tutorial => {
                    const matchers = (Array.isArray(tutorial.startTrigger) ? tutorial.startTrigger : [tutorial.startTrigger])
                        .concat(Array.isArray(tutorial.completionTrigger) ? tutorial.completionTrigger : [tutorial.completionTrigger]);
                    matchers.forEach(matcher => {
                        const typeMatch = matcher.type === "auto" || matcher.type === type;
                        const targetMatch = !matcher.target || ev?.target?.matches(matcher.target);
                        if (typeMatch && targetMatch) {
                            tutorialsToUpdate.push({
                                tutorial,
                                matcher
                            });
                        }

                    });
                });
                if (tutorialsToUpdate.length > 0) {
                    dispatch(getActions().UpdateTutorialTriggers(tutorialsToUpdate));
                }
            }
        };
        // Add listener to body to check for events when there is no active tutorial
        document.body.addEventListener("click", onEventReceived("click"));
        document.body.addEventListener("tutorialComplete", onEventReceived("complete"));
        if (document.readyState !== "complete") {
            document.body.addEventListener("DOMContentLoaded", onEventReceived("auto"));
        } else {
            onEventReceived("auto")({});
        }
    }
}