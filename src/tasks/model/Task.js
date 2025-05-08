import moment from "moment";
import PropTypes from "prop-types";

export default class Task {
    id // The unique id of the task
    title // The main title of the task
    description // A description of the task
    createdAt // When the task was created
    repeats // If the task repeats multiple times or is a one-time task
    lastCompleted // Array, the last time that the task was completed, for repeat tasks

    /**
     * Prefer using the builder returned from 'createTask' on the Task prototype.
     */
    constructor(id, title, description, repeats, createdAt, lastCompleted) {
        if (typeof (id) !== "string") {
            throw "Task id must be a string but was " + typeof (id);
        }
        this.id = id;
        if (typeof (description) !== "string") {
            throw "Task description must be a string but was " + typeof (description);
        }

        if (typeof (title) !== "string") {
            throw "Task title must be a string but was " + typeof (title);
        }

        if (!Array.isArray(lastCompleted)) {
            throw "Task lastCompleted must be an array but was " + typeof (lastCompleted);
        }
        this.lastCompleted = lastCompleted;

        this.createdAt = createdAt;

        this.description = description;
        this.title = title;

        if (typeof (repeats) !== "string") {
            throw "Task repeats must be a string but was " + typeof (repeats);
        }

        if (new RegExp("WEEKLY-[01]{7}").test(repeats) || new RegExp("MONTHLY-[01]{31}").test(repeats)) {
            this.repeats = repeats;
        } else {
            switch (repeats.split("-")[0]) {
                case "DAILY":
                case "NEVER":
                    this.repeats = repeats;
                    break;
                default:
                    throw "Task repeats must be one of the following: 'NEVER', 'DAILY', 'WEEKLY-XXXXXXX' or 'MONTHLY-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' (where X is a 0 or 1) but was '" + repeats + "'";
            }
        }
    }
}

class TaskBuilder {
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.description = "";
        this.scheduledTime = moment().startOf("day").toISOString();
        this.lastCompleted = [];
        this.repeatsOn = "NEVER";
        this.repeatDays = [];
        this.wasCreatedAt = moment().startOf("day").toISOString();
    }

    createdAt(createdAt) {
        this.wasCreatedAt = moment(createdAt).toISOString();
        return this;
    }

    withDescription(description) {
        this.description = description;
        return this;
    }

    scheduledFor(scheduledTime) {
        this.scheduledTime = moment(scheduledTime).toISOString();
        return this;
    }

    thatRepeats(repeats) {
        if(typeof(repeats) !== "string") {
            throw "Task repeats must be a string but was " + typeof(repeats);
        }
        if (!["NEVER", "DAILY", "WEEKLY", "MONTHLY"].includes(repeats.toUpperCase())) {
            throw `Repeats must be one of the following: 'NEVER', 'DAILY', 'WEEKLY' or 'MONTHLY', but was '${repeats}'. To specify which days to repeat, use 'thatRepeatsOn' instead.`;
        }
        switch(repeats.toUpperCase()) {
            case "WEEKLY":
                this.repeatDays = new Array(7).fill(0);
                break;
            case "MONTHLY":
                this.repeatDays = new Array(31).fill(0);
                break;
        }

        this.repeatsOn = repeats.toUpperCase();
        return this;
    }

    thatRepeatsOn(repeatDays) {
        if (this.repeatsOn === "WEEKLY") {
            if (repeatDays.length !== 7) {
                throw "Repeat days must be an array of 7 numbers."
            }
            this.repeatDays = repeatDays;
        } else if (this.repeatsOn === "MONTHLY") {
            if (repeatDays.length < 28 || repeatDays.length > 31) {
                throw "Repeat days must be an array of 31 numbers."
            }
            this.repeatDays = repeatDays;
        } else {
            throw "Cannot set repeat days on a task that does not repeat WEEKLY or MONTHLY. Use 'thatRepeats' to set it to 'WEEKLY' or 'MONTHLY' first.";
        }
        return this;
    }

    wasLastCompleted(completed) {
        if (!Array.isArray(completed)) {
            this.lastCompleted = [completed];
        } else {
            this.lastCompleted = completed;
        }
        return this;
    }

    build() {
        let repeats;
        if(this.repeatsOn === "DAILY" || this.repeatsOn === "NEVER") {
            repeats = this.repeatsOn;
        } else if(this.repeatsOn === "WEEKLY") {
            repeats = this.repeatsOn + "-" + this.repeatDays.join("");
        } else if (this.repeatsOn === "MONTHLY") {
            repeats = this.repeatsOn + "-" + this.repeatDays.join("");
        }

        return new Task(this.id, this.title, this.description,
            repeats,
            this.wasCreatedAt,
            this.lastCompleted);
    }
}

Task.createTask = function (id) {
    return new TaskBuilder(id, "New Task");
}

export const ModelPropTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    repeats: PropTypes.string,
    scheduledTime: PropTypes.string
});

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

// TODO: In these functions, transform the task object into an instance of Task.
Task.calculateScheduledTime = function (task, now) {
    now = moment(now) || moment().startOf("day");
    const repeatConfig = task.repeats.split("-");
    const repeats = repeatConfig[0];

    switch (repeats) {
        case "NEVER":
            return task.createdAt; // For tasks that never repeat, return the original scheduled time.
        case "DAILY":
            if(task.lastCompleted.length === 0) {
                return now.startOf("day").toISOString();
            }

            // If it has been completed today, return tomorrow
            const lastCompletedDay = moment(task.lastCompleted[0]).startOf("day");
            if (lastCompletedDay.diff(now.startOf("day")) === 0) {
                return now.add(1, "days").startOf("day").toISOString();
            }
            // If it has been completed in the past, return the day after completion
            if (lastCompletedDay.diff(now.startOf("day")) < 0) {
                return lastCompletedDay.add(1, "days").toISOString();
            }

            return now.startOf("day").toISOString();
        case "WEEKLY":
            const repeatsToday = repeatConfig[1].split("").some((x, i) => i === now.weekday() === i && x === "1");
            // If it has been completed in the past or never and repeats today, return today
            if ((task.lastCompleted.length === 0 || moment(task.lastCompleted[0]).startOf("day").diff(now.startOf("day")) < 0) && repeatsToday) {
                return moment().startOf("day");
            } else if(!repeatsToday || moment(task.lastCompleted[0]).startOf("day").diff(now.startOf("day")) === 0) {
                // If it does not repeat today or has been completed today find the next day it does repeat
                const todayOfWeek = now.day();
                for (let i = 0; i < 7; i++) {
                    const index = (todayOfWeek + i) % 7;
                    if (repeatConfig[1][index] === "1") {
                        return now.add(i, "days").toISOString();
                    }
                }
            }

            break;
        case "MONTHLY":
            // If repeats today
            const repeatDays = repeatConfig[1].split("");
            const repeatsTodayMonthly = repeatConfig[1].split("").some((x, i) => i === now.date() - 1 && x === "1");
            if(repeatsTodayMonthly) {
                // If never completed, return today
                if (task.lastCompleted.length === 0) {
                    return now.startOf("day").toISOString();
                }
                // If completed in the past and there is a repeat time between then and now, return the first repeat time between then and now
                if (moment(task.lastCompleted[0]).startOf("day").diff(now.startOf("day")) < 0) {
                    const lastCompletedDay = moment(task.lastCompleted[0]).startOf("day");
                    for (let i = 0; i < 31; i++) {
                        const nextDay = (lastCompletedDay.date() + i - 1) % 31;
                        if (repeatConfig[1][nextDay] === "1") {
                            return lastCompletedDay.add(i, "days").toISOString();
                        }
                    }
                }
                // if completed today, return the next repeat time
                if (moment(task.lastCompleted[0]).startOf("day").diff(now.startOf("day")) === 0) {
                    for (let i = 1; i < 31; i++) {
                        const nextDay = (now.date() + i - 1) % 31;
                        if (repeatConfig[1][nextDay] === "1") {
                            return now.add(i, "days").toISOString();
                        }
                    }
                }
            }

            // If created in the past and there is a repeat time between then and now, return the first repeat time between then and now
            if (moment(task.createdAt).startOf("day").diff(now.startOf("day")) < 0) {
                const createdDay = moment(task.createdAt).startOf("day");
                for (let i = 0; i < 31; i++) {
                    const nextDay = (createdDay.date() + i - 1) % 31;
                    if (repeatConfig[1][nextDay] === "1") {
                        return createdDay.add(i, "days").toISOString();
                    }
                }
            }

            // If the next repeat time this month is after today but today is the last day of the month, repeat today
            if (repeatDays.findLastIndex(x => x === "1") > now.date()) {
                return now.startOf("day").toISOString();
            }
            break;
        default:
            throw "Task repeats must be one of the following: NEVER, DAILY, WEEKLY, MONTHLY but was " + repeats;
    }
    throw "Unable to calculate scheduled time for task.";
};
