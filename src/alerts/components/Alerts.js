import {useDispatch, useSelector} from "react-redux";
import {Alert} from "@mui/material";
import {useEffect, useState} from "react";
import {getActions} from "../configuration/AlertsStateConfiguration";
import Collapse from "@mui/material/Collapse";
import * as React from "react";

export default function Alerts() {
    const [shouldBeVisible, setShouldBeVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const queuedAlerts = useSelector(state => {
        return state.alerts.queued;
    });
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
            onEnter={() => {
                setIsVisible(true);
                setTimeout(() => {
                    setShouldBeVisible(false)
                }, 250 + (lastAlert.message.length * 200)) // TODO: Constant instead of literal
            }}
            in={shouldBeVisible}
            out={!shouldBeVisible}
            onExited={() => {
                dispatch(getActions().Clear());
                setLastAlert(null);
                setIsVisible(setShouldBeVisible(false));
            }}
        >
            <Alert
                severity={lastAlert?.type}
            >
                {lastAlert?.message}
            </Alert>
        </Collapse>
    </React.Fragment>;
}