import moment from "moment";
import PropTypes from "prop-types";

export default class Task {
    id
    title
    description
    scheduledTime
    repeats

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
    }
}

export const ModelPropTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    repeats: PropTypes.shape({
        repeatType: PropTypes.oneOf(["DAILY", "WEEKLY", "MONTHLY"]),
        repeatOn: PropTypes.arrayOf(PropTypes.bool)
    }),
    scheduledTime: PropTypes.instanceOf(moment)
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