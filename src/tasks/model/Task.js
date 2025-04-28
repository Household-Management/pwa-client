import moment from "moment";
import PropTypes from "prop-types";

export default class Task {
    id
    title
    description
    scheduledTime
    repeats
    lastCompleted

    constructor(id, title, description) {
        this.id = id;
        if (typeof (description) !== "string") {
            throw "Task description must be a string"
        }
        this.description = description;
        if (typeof (title) !== "string") {
            throw "Task title must be a string"
        }
        this.title = title;
        this.scheduledTime = moment("12 00", "HH mm").toISOString(false);
        this.repeats = RepeatDaily();
        this.lastCompleted = [];
    }
}

export const ModelPropTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    repeats: PropTypes.string,
    scheduledTime: PropTypes.string
});

export function RepeatDaily() {
    return "DAILY"
}

export function RepeatWeekly(repeatDays) {
    if(!repeatDays || repeatDays.length !== 7) {
        throw "Repeat days must be an array of 7 booleans, one for each day of the week."
    }
    return "WEEKLY-" + repeatDays.map(x => x ? 1 : 0).join("");
}

export function RepeatMonthly(repeatDays) {
    if(!repeatDays || repeatDays.length > 31 || repeatDays.length < 28) {
        throw "Repeat days must be an array of no more than 31 and no less than 28 booleans, one for each day of the month."
    }
    return "MONTHLY-" + repeatDays.map(x => x ? 1 : 0).join("");
}

Task.dueToday = function(task) {
    const repeatConfig = task.repeats.split("-");
    const repeat = repeatConfig[0];
    const repeatInterval = repeatConfig[1]?.split("")?.map(i => i === "1" ? "0" : i);
    const now = moment();

    switch (repeat) {
        case "DAILY":
            return !task.lastCompleted ||
                task.lastCompleted.length === 0 ||
                moment(task.lastCompleted[1]).diff(now) <= 0;
        case "WEEKLY":
            // If the task is not completed, is due this day of the week and last completed is in the past, make it available.
            return false;
        case "MONTHLY":
            break;
    }
    return !task.completed && moment().diff(moment(task.scheduledTime, 'days')) <= 0
}

Task.pastDue = function(task) {
    const dueNow = !!Task.dueToday(task)
    const scheduledInPast = moment(task.scheduledTime).diff(moment(), "days") < 0;
    return dueNow && scheduledInPast;
}
