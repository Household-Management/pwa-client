import {Box, Paper, Popper} from "@mui/material";
import React, {Fragment, useRef} from "react";
import PropTypes from "prop-types";

export function TutorialPopper({ targetElement, open, sx, children, highlightTarget }) {
    const lastTarget = useRef(null);
    if(open && targetElement) {
        if(lastTarget.current && lastTarget.current !== targetElement) {
            lastTarget.current.style.zIndex = 0;
        }
        targetElement.style.zIndex = highlightTarget ? 100 : 0;
        lastTarget.current = targetElement;
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
            pointerEvents: "none",
            ...sx
        }}/>
        <Popper style={{zIndex: 1}} anchorEl={targetElement} open={open}>
            {children}
        </Popper>
    </Fragment>
}

TutorialPopper.propTypes = {
    targetElement: PropTypes.object,
    open: PropTypes.bool.isRequired,
    children: PropTypes.array.isRequired,
    highlightTarget: PropTypes.bool
}