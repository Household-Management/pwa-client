import TaskDueAlert from "./TaskDueAlert";
import Task, {RepeatDaily} from "../model/Task";
import moment from "moment";
import {fn} from "@storybook/test";
import {Fragment} from "react";
import {Notifications} from "@mui/icons-material";

export default {
    component: TaskDueAlert,
}

export const ShowsTask = {
    args: {
        task: {
            id: "1",
            title: "Test Task",
            description: "Hello World",
            scheduledTime: moment("12 00", "HH mm").toISOString(false),
            repeats: RepeatDaily()
        },
        onComplete: fn(),
        onSnooze: fn(),
        onCancel: fn()
    },
}

export const OpenTaskNotification = {
    args: {
        task: {
            id: "1",
            title: "Test Task",
            description: "Hello World",
            scheduledTime: moment("12 00", "HH mm").toISOString(false),
            repeats: RepeatDaily()
        },
        onComplete: fn(),
        onSnooze: fn(),
        onCancel: fn()
    },
    render: (args) => <Fragment>
        WIP
        {/*TODO: Move into application side, rather than storybook/test side.*/}
        <button onClick={() => {
            Notification.requestPermission().then((x) => {
                if (x === "granted") {
                    // FIXME: Windows only allows two actions.
                    navigator.serviceWorker.getRegistration()
                        .then(reg => {
                                reg.active.postMessage({type: "SHOW_NOTIFICATION"})
                            });
                } else {
                    alert("Permission Denied");
                }
            });
        }}>Open Notification
        </button>
    </Fragment>
}