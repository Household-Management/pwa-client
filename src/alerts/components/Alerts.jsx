import {useDispatch, useSelector} from "react-redux";
import {Alert} from "@mui/material";
import {useEffect, useState} from "react";
import {Clear} from "../configuration/AlertsStateConfiguration";
import Collapse from "@mui/material/Collapse";
import * as React from "react";

export default function Alerts({ queuedAlerts, sx }) {
    const [shouldBeVisible, setShouldBeVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [lastAlert, setLastAlert] = useState(null);

    useEffect(() => {
        if(!lastAlert && queuedAlerts.length > 0) {
            setLastAlert(queuedAlerts[0]);
        }
    }, [lastAlert, queuedAlerts]);

    useEffect(() => {
        if (lastAlert) {
            if(!isVisible) {
                setShouldBeVisible(true);
            }
        } else {
            setShouldBeVisible(false);
        }
    }, [lastAlert, queuedAlerts, isVisible]);

    const dispatch = useDispatch();

    return <React.Fragment>
        <Collapse
            sx={{position: "absolute", maxWidth: sx?.maxWidth || "60%", minWidth: sx?.minWidth || "400px", zIndex: 100}}
            onEnter={() => {
                setIsVisible(true);
                // Max 10 seconds
                const time = Math.max(1000, Math.min(10 * 1000, (lastAlert.message.length * 200)))
                setTimeout(() => {
                    setShouldBeVisible(false)
                }, time) // TODO: Constant instead of literal
            }}
            in={shouldBeVisible}
            onExited={() => {
                dispatch(Clear());
                setLastAlert(null);
                setIsVisible(setShouldBeVisible(false));
            }}
        >
            <Alert
                severity={lastAlert?.type}
                onClose={() => {
                    setShouldBeVisible(false);
                }}
            >
                {lastAlert?.message}
            </Alert>
        </Collapse>
    </React.Fragment>;
}