import moment from "moment";
import PropTypes from "prop-types";

export default class Task {
    id // The unique id of the task
    title // The main title of the task
    description // A description of the task
    scheduledTime // The time that the task is scheduled to begin
    repeats // If the task repeats multiple times or is a one-time task
    lastCompleted // Array, the last time that the task was completed, for repeat tasks

    /**
     * Prefer using the builder returned from 'createTask' on the Task prototype.
     */
    constructor(id, title, description, repeats, scheduledTime) {
        if (typeof (id) !== "string") {
            throw "Task id must be a string but was " + typeof (id);
        }
        this.id = id;
        if (typeof (description) !== "string") {
            throw "Task description must be a string but was " + typeof (description);
        }

        if (typeof (title) !== "string") {
            throw "Task title must be a string but was" + typeof (title);
        }

        this.description = description;
        this.title = title;
        if (typeof (scheduledTime) !== "string") {
            throw "Task scheduledTime must be a string but was " + typeof (scheduledTime);
        }
        this.scheduledTime = scheduledTime;
        // this.scheduledTime = moment().startOf("day").toISOString(false);

        if (typeof (repeats) !== "string") {
            throw "Task repeats must be a string but was " + typeof (repeats);
        }

        switch (repeats.split("-")[0]) {
            case "DAILY":
                break;
            case "WEEKLY":
                repeats = "WEEKLY-" + new Array(7).fill(0).join("");
                break;
            case "MONTHLY":
                repeats = "MONTHLY-" + new Array(31).fill(0).join("");
                break;
            case "NEVER":
                break;
            default:
                throw "Task repeats must be one of the following: DAILY, WEEKLY, MONTHLY but was " + repeats;
        }
        this.repeats = repeats;
        this.lastCompleted = [];
    }
}

class TaskBuilder {
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.description = "";
        this.scheduledTime = moment().startOf("day").toISOString();
    }

    withDescription(description) {
        this.description = description;
        return this;
    }

    withScheduledTime(scheduledTime) {
        this.scheduledTime = moment(scheduledTime).toISOString();
        return this;
    }

    repeats(repeats) {
        if (!["NEVER", "DAILY", "WEEKLY", "MONTHLY"].includes(repeats.split("-")[0].toUpperCase())) {
            throw "Repeats must be one of the following: NEVER, DAILY, WEEKLY, MONTHLY.";
        }
        this.repeats = repeats.toUpperCase();
        return this;
    }

    build() {
        return new Task(this.id, this.title, this.description, this.repeats, this.scheduledTime);
    }
}

Task.createTask = function(id) {
    return new TaskBuilder(id, "New Task");
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
            const dueToday = repeatConfig[1].split("").some((weekDay, index) => {
                return index === todayOfWeek && weekDay === "1";
            });

            if (!dueToday) {
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

Task.calculateScheduledTime = function (task) {
    const now = moment().startOf("day");
    const repeatConfig = task.repeats.split("-");
    const repeats = repeatConfig[0];

    switch (repeats) {
        case "NEVER":
            return task.scheduledTime; // For tasks that never repeat, return the original scheduled time.
        case "DAILY":
            if (task.lastCompleted.length === 0) {
                return task.scheduledTime;
            }

            // If it has been completed today, return tomorrow
            const lastCompletedDay = moment(task.lastCompleted[0]).set("hours", 0).set("minutes", 0).set("seconds", 0).set("millisecond", 0);
            if (lastCompletedDay.diff(now) === 0) {
                return now.add(1, "days").toISOString();
            }
            // If it has been completed in the past, return the day after completion
            if (lastCompletedDay.diff(now) < 0) {
                return now.add(1, "days").toISOString();
            }

            return task.scheduledTime;
        case "WEEKLY":
            const repeatDays = repeatConfig[1].split("").map(day => day === "1");
            for (let i = 0; i < 7; i++) {
                const nextDay = now.clone().add(i, "days").day();
                if (repeatDays[nextDay]) {
                    return now.add(i, "days").toISOString();
                }
            }
            break;
        case "MONTHLY":
            const todayOfMonth = now.date();
            const monthlyDays = repeatConfig[1].split("").map(day => day === "1");
            for (let i = 0; i < 31; i++) {
                const nextDay = (todayOfMonth + i - 1) % 31;
                if (monthlyDays[nextDay]) {
                    return now.add(i, "days").toISOString();
                }
            }
            break;
        default:
            throw "Task repeats must be one of the following: NEVER, DAILY, WEEKLY, MONTHLY but was " + repeats;
    }
    throw "Unable to calculate scheduled time for task.";
};
