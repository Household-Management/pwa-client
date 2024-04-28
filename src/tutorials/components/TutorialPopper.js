import {Box, Paper, Popper} from "@mui/material";
import React, {Fragment, useRef, useMemo} from "react";
import PropTypes from "prop-types";

export function TutorialPopper({ targetElementSelectors, open, sx, children, highlightTarget }) {
    const lastTargets = useRef(null);
    let targetElements = useMemo(() => {;
        const selector = !targetElementSelectors || typeof targetElementSelectors === "string" ? targetElementSelectors : targetElementSelectors.join(", ");
        // FIXME: Make resilient for bad selectors, as querySelector can throw.
        if(typeof(targetElementSelectors) === "string") {
            return document.querySelectorAll(selector);
        } else if(Array.isArray(targetElementSelectors)) {
            return document.querySelectorAll(selector);
        }
    }, [targetElementSelectors, open]);

    if(open && targetElements) {
        if(lastTargets.current) {
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
            visibility: open ? "visible" : "hidden",
            ...sx
        }}/>
        <Popper style={{zIndex: 1}} anchorEl={targetElements && targetElements[0]} open={open}>
            {children}
        </Popper>
    </Fragment>
}

TutorialPopper.propTypes = {
    targetElementSelectors: PropTypes.arrayOf(PropTypes.string),
    open: PropTypes.bool.isRequired,
    children: PropTypes.array.isRequired,
    highlightTarget: PropTypes.bool
}