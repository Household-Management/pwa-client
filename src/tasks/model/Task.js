import moment from "moment";
import PropTypes from "prop-types";

export default class Task {
    id
    title
    description
    scheduledTime
    repeats
    lastCompleted

    constructor(id, title, description, repeats) {
        if (typeof (id) !== "string") {
            throw "Task id must be a string"
        }
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

        if (repeats === undefined) {
            repeats = "DAILY";
        }
        switch (repeats.toLowerCase()) {
            case "daily":
                this.repeats = RepeatDaily();
                break;
            case "weekly":
                this.repeats = RepeatWeekly([false, false, false, false, false, false, false]);
                break;
            case "monthly":
                this.repeats = RepeatMonthly(new Array(31).fill(false));

                break;
            default:
                throw "Task repeats must be one of the following: DAILY, WEEKLY, MONTHLY but was " + repeats;

        }
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
    if (!repeatDays || repeatDays.length !== 7) {
        throw "Repeat days must be an array of 7 booleans, one for each day of the week."
    }
    return "WEEKLY-" + repeatDays.map(x => x ? 1 : 0).join("");
}

export function RepeatMonthly(repeatDays) {
    if (!repeatDays || repeatDays.length > 31 || repeatDays.length < 28) {
        throw "Repeat days must be an array of no more than 31 and no less than 28 booleans, one for each day of the month."
    }
    return "MONTHLY-" + repeatDays.map(x => x ? 1 : 0).join("");
}

Task.dueToday = function (task, today) {
    const repeatConfig = task.repeats.split("-");
    const repeats = repeatConfig[0];
    const now = (moment(today) || moment()).set("hours", 0).set("minutes", 0).set("seconds", 0).set("millisecond", 0);

    const neverCompleted = !task.lastCompleted || task.lastCompleted.length === 0;
    const completedInThePast = task.lastCompleted && task.lastCompleted.length > 0 && moment(task.lastCompleted[0]).diff(now) < 0;

    switch (repeats) {
        case "NEVER":
            return true;
        case "DAILY":
            if (neverCompleted) {
                return true;
            }
            const lastCompletedDay = moment(task.lastCompleted[0]).set("hours", 0).set("minutes", 0).set("seconds", 0).set("millisecond", 0);
            return lastCompletedDay.diff(now) <= -1;
        case "WEEKLY":
            const todayOfWeek = now.day();
            const dueToday =  repeatConfig[1].split("").some((weekDay, index) => {
                return index === todayOfWeek && weekDay === "1";
            });

            if(!dueToday) {
                return false;
            }

            return dueToday && neverCompleted;
        case "MONTHLY":
            const todayOfMonth = now.date();
            const repeatDays = repeatConfig[1].split("");
            const dueTodayMonthly = repeatDays.some((day, index) => {
                return index === todayOfMonth - 1 && day === "1";
            });

            if (!dueTodayMonthly) {
                return false;
            }

            return dueTodayMonthly && (neverCompleted || completedInThePast);
        default:
            throw "Task repeats must be one of the following: NEVER, DAILY, WEEKLY, MONTHLY but was " + repeats;
    }
}

Task.pastDue = function (task) {
    const dueNow = !!Task.dueToday(task)
    const scheduledInPast = moment(task.scheduledTime).diff(moment(), "days") < 0;
    return dueNow && scheduledInPast;
}
