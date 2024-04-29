import {Box, Paper, Popper} from "@mui/material";
import React, {Fragment, useRef, useMemo, useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getActions} from "../state/TutorialStateConfiguration";

export function TutorialPopper({
                                   activeTutorial,
                                   sx,
                                   children,
                                   dispatch
                               }) {
    const matcher = useRef(null)
    const {targetElements: targetElementSelectors, highlightTarget = true, completionMatcher} = activeTutorial || {};
    matcher.current = completionMatcher;
    const lastTargets = useRef(null);
    let targetElements = useMemo(() => {
        ;
        const selector = !targetElementSelectors || typeof targetElementSelectors === "string" ? targetElementSelectors : targetElementSelectors.join(", ");
        // FIXME: Make resilient for bad selectors, as querySelector can throw.
        if (typeof (targetElementSelectors) === "string") {
            return document.querySelectorAll(selector);
        } else if (Array.isArray(targetElementSelectors)) {
            return document.querySelectorAll(selector);
        }
    }, [targetElementSelectors, activeTutorial != null]);

    const tutorialForMatching = useRef(null);
    // Use to make the tutorial available inside the click handler.
    tutorialForMatching.current = activeTutorial;

    useEffect(() => {
        // FIXME: Unsubscribe when called multiple times or remove need of multiple calls.
        targetElements?.forEach(el => {
            el.addEventListener("click", ev => {
                if (matcher.current && matcher.current.type === "click") {
                    if (ev.target.matches(matcher.current.target)) {
                        dispatch(getActions().CompleteTutorial());
                    }
                }
            });
        });
    }, [targetElementSelectors, activeTutorial != null]);

    if (activeTutorial !== null && targetElements) {
        if (lastTargets.current) {
            lastTargets.current.forEach(el => el.style.zIndex = 0);
        }
        targetElements.forEach(el => el.style.zIndex = highlightTarget ? 100 : 0);
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