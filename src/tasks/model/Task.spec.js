import Task, {firstDueDayBetween, RepeatMonthly} from "./Task";
import moment from "moment";

describe('Task', () => {
    describe('validation', () => {
        it('must have a title', () => {
            expect(() => {
                new Task("id", null, "description")
            }).toThrow("Task title must be a string but was object");
        });
        it('must have a description', () => {
            expect(() => {
                new Task("id", "title", null)
            }).toThrow("Task description must be a string but was object");
        });
        it('must have an id', () => {
            expect(() => {
                new Task(null, "title", "description");
            }).toThrow("Task id must be a string but was object");
        });
        it("must have a repeats", () => {
            expect(() => {
                new Task("", "title", "description", "repeats", moment().toISOString(), []);
            }).toThrow("Task repeats must be one of the following: 'NEVER', 'DAILY', 'WEEKLY-XXXXXXX' or 'MONTHLY-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' (where X is a 0 or 1) but was 'repeats'");

            expect(() => {
                new Task("", "title", "description", 1, moment().toISOString(), []);
            }).toThrow("Task repeats must be a string but was number");

            expect(() => {
                Task.createTask("").thatRepeats(1).build();
            }).toThrow("Task repeats must be a string but was number");

            expect(() => {
                Task.createTask("").thatRepeats("whenever").build();
            }).toThrow("Repeats must be one of the following: 'NEVER', 'DAILY', 'WEEKLY' or 'MONTHLY', but was 'whenever'. To specify which days to repeat, use 'thatRepeatsOn' instead.");
        });
        it("must have exactly 7 days for weelky repeats", () => {
            expect(() => {
                Task.createTask("").thatRepeats("weekly").thatRepeatsOn([1, 0, 0, 0, 0, 0]).build();
            }).toThrow("Repeat days must be an array of 7 numbers.");

            expect(() => {
                Task.createTask("").thatRepeats("weekly").thatRepeatsOn([1, 0, 0, 0, 0, 0, 0, 0]).build();
            }).toThrow("Repeat days must be an array of 7 numbers.");
        });
        it("must have exactly 31 days for monthly repeats", () => {
            expect(() => {
                Task.createTask("").thatRepeats("monthly").thatRepeatsOn([1, 0, 0, 0, 0, 0]).build();
            }).toThrow("Repeat days must be an array of 31 numbers.");

            expect(() => {
                Task.createTask("").thatRepeats("monthly").thatRepeatsOn(new Array(32).fill(0)).build();
            }).toThrow("Repeat days must be an array of 31 numbers.");
        });
        it("cannot specify repeats days for never", () => {
            expect(() => {
                Task.createTask("").thatRepeats("never").thatRepeatsOn([1, 0, 0, 0, 0, 0]).build();
            }).toThrow("Cannot set repeat days on a task that does not repeat WEEKLY or MONTHLY. Use 'thatRepeats' to set it to 'WEEKLY' or 'MONTHLY' first.");
        });
        it("cannot specify repeats days for daily", () => {
            expect(() => {
                Task.createTask("").thatRepeats("daily").thatRepeatsOn([1, 0, 0, 0, 0, 0]).build();
            }).toThrow("Cannot set repeat days on a task that does not repeat WEEKLY or MONTHLY. Use 'thatRepeats' to set it to 'WEEKLY' or 'MONTHLY' first.");
        });
    });
    describe('creating', () => {
        it.each(["NEVER", "DAILY", "WEEKLY", "MONTHLY"])('can be created with a repeat configuration', (repeats) => {
            const task = Task.createTask("").thatRepeats(repeats).build()
            expect(task.repeats.startsWith(repeats)).toBeTruthy();
        });
        it("can have a description", () => {
            expect(Task.createTask("").withDescription("description").build().description).toBe("description");
        });
    });
    describe("which repeats never", () => {
        it("is always due today", () => {
            expect(Task.dueToday({
                lastCompleted: [],
                repeats: "NEVER"
            })).toBeTruthy();
        });
        it("is scheduled for the start of the day it was created", () => {
            const task = Task.createTask("").thatRepeats("NEVER").build();
            expect(Task.calculateScheduledTime(task)).toEqual(moment().startOf("day").toISOString());
        });
    });
    describe("which repeats daily", () => {
        it('has a value of `DAILY`', () => {
            const task = Task.createTask("id").thatRepeats("daily").build();
            expect(task.repeats).toBe("DAILY");
        });
        it('is due today if never completed', () => {
            const task = {
                lastCompleted: [],
                repeats: "DAILY"
            };
            expect(Task.calculateScheduledTime(task)).toEqual(moment().startOf("day").toISOString());
            expect(Task.dueToday(task)).toBeTruthy();
        });
        it('is due today if last completed in the past', () => {
            const task = Task.createTask("").thatRepeats("DAILY")
                .wasLastCompleted([moment().subtract(1, "day").startOf("day").toISOString()])
                .build();

            expect(Task.calculateScheduledTime(task)).toEqual(moment().startOf("day").toISOString());
            expect(Task.dueToday(task)).toBeTruthy();
        });
        it('is not due today if last completed is today', () => {
            const task = {
                lastCompleted: [moment().toISOString()],
                repeats: "DAILY"
            };

            expect(Task.dueToday(task)).toBeFalsy();
        });
        it("schedules for the next time it repeats after completion", () => {
            const task = Task.createTask("id")
                .createdAt(moment("1-1-2025", "DD-MM-YYYY").subtract(3, "day"))
                .thatRepeats("DAILY").build();
            task.lastCompleted = [moment()];
            expect(Task.calculateScheduledTime(task, moment("1-2-2025", "DD-MM-YYYY"))).toEqual(moment("1-2-2025", "DD-MM-YYYY").startOf("day")
                .toISOString());
        });
        it("is due today if somehow completed in the future", () => {
            const task = Task.createTask("id").thatRepeats("DAILY").wasLastCompleted(moment().add(1, "day")).build();
            expect(Task.calculateScheduledTime(task)).toEqual(moment().startOf("day").toISOString());
        });
    });
    describe('which repeats weekly', () => {
        it('has a value of `WEEKLY`', () => {
            const task = Task.createTask("id").thatRepeats("WEEKLY").build();
            expect(task.repeats).toBe("WEEKLY-0000000");
        });
        it('is due today if never completed', () => {
            const task = {
                lastCompleted: [],
                repeats: "WEEKLY-1000000"
            };

            const now = moment().day(0).set("hour", 0).set("minute", 0).set("second", 0);

            expect(Task.dueToday(task, now)).toBeTruthy();
        });
        it('is due today if completed in the past and repeats today', () => {
            const task = {
                lastCompleted: [moment().day(0).subtract(1, "day").toISOString()],
                repeats: "WEEKLY-1000000"
            };

            const now = moment().day(0).startOf("day");
            expect(Task.calculateScheduledTime(task, now)).toEqual(now.toISOString());
            expect(Task.dueToday(task, now)).toBeFalsy();
        });
        it('is not due today if last completed is today', () => {
            const task = {
                lastCompleted: [moment().day(0).toISOString()],
                repeats: "WEEKLY-1000000"
            };

            const now = moment().day(0).startOf("day");

            expect(Task.dueToday(task, now)).toBeFalsy();
        });
        it('is not due today if today is not in repeat pattern', () => {
            const task = {
                lastCompleted: [],
                repeats: "WEEKLY-0000001"
            }

            const now = moment().day(0).set("hour", 0).set("minute", 0).set("second", 0);
            expect(Task.dueToday(task, now)).toBeFalsy();
        });
        it('throws if weekly is not formatted correctly', () => {
            expect(() => {
                new Task("1", "title", "description", "notweekly");
            }).toThrow();
        });
        it.each([0, 1, 2, 3, 4, 5, 6])('is scheduled for the next day of the week in the future', (dayOfWeek) => {
            const task = Task.createTask("")
                .createdAt(moment("12-31-2024", "MM-DD-YYYY").toISOString())
                .wasLastCompleted([moment("12-31-2024", "MM-DD-YYYY").toISOString()])
                .thatRepeats("WEEKLY")
                .thatRepeatsOn(new Array(7).fill(0).map((x, i) => {
                    return i === dayOfWeek ? "1" : "0";
                }))
                .build();
            let expectedTime;
            switch(dayOfWeek) {
                case 0:
                    expectedTime = moment("5-1-2025", "DD-MM-YYYY").toISOString();
                    break
                case 1:
                    expectedTime = moment("6-1-2025", "DD-MM-YYYY").toISOString();
                    break
                case 2:
                    expectedTime = moment("7-1-2025", "DD-MM-YYYY").toISOString();
                    break
                case 3:
                    expectedTime = moment("1-1-2025", "DD-MM-YYYY").toISOString();
                    break
                case 4:
                    expectedTime = moment("2-1-2025", "DD-MM-YYYY").toISOString();
                    break
                case 5:
                    expectedTime = moment("3-1-2025", "DD-MM-YYYY").toISOString();
                    break
                case 6:
                    expectedTime = moment("4-1-2025", "DD-MM-YYYY").toISOString();
                    break;
            }
            const scheduledTime = Task.calculateScheduledTime(task, moment("1-1-2025", "DD-MM-YYYY"))
            // 01-01-2025 was a wednesday
            expect(scheduledTime)
                .toEqual(expectedTime);
        });
        it.each(new Array(7).fill(1))("can define the days of the week for repeating", x => {
            const task = Task.createTask("").thatRepeats("weekly").thatRepeatsOn(new Array(7).fill(0).map((_, i) => i === x ? 1 : 0)).build();
            expect(task.repeats.split("-")[1].split("").map(x => Number.parseInt(x)))
                .toEqual(new Array(7).fill(0).map((_, i) => i === x ? 1 : 0));
        });
    });
    describe('which repeats monthly', () => {
        it("returns the first repeat time between creation and now if it is between them", () => {
            const task = Task.createTask("id")
                .thatRepeats("MONTHLY")
                .thatRepeatsOn(new Array(31).fill(0).map((_, i) => i === 1 ? 1 : 0)) // Set the 2nd day of the month
                .scheduledFor(moment("2023-01-01").startOf("day").toISOString())
                .createdAt(moment("2023-01-01").startOf("day").toISOString())
                .build();

            expect(firstDueDayBetween(moment("2023-01-01").startOf("day"), moment("2023-01-03").startOf("day")).for(task).toISOString())
                .toEqual(moment("2023-01-02").startOf("day").toISOString());
        });
        it("returns now when the next repeat time between creation and now is now", () => {
            const task = Task.createTask("id")
                .thatRepeats("MONTHLY")
                .thatRepeatsOn(new Array(31).fill(0).map((_, i) => i === 2 ? 1 : 0)) // Set the 2nd day of the month
                .scheduledFor(moment("2023-01-01").startOf("day").toISOString())
                .createdAt(moment("2023-01-01").startOf("day").toISOString())
                .build();

            expect(firstDueDayBetween(moment("2023-01-01").startOf("day"), moment("2023-01-03").startOf("day")).for(task).toISOString())
                .toEqual(moment("2023-01-03").startOf("day").toISOString());
        });
        it('has a value of `MONTHLY`', () => {
            const task = Task.createTask("id").thatRepeats("MONTHLY").build();
            expect(task.repeats).toBe("MONTHLY-" + new Array(31).fill(0).join(""));
        });
        it('has a value of `MONTHLY` with all days set to false', () => {
            const task = Task.createTask("id").thatRepeats("MONTHLY").build();
            expect(task.repeats).toBe("MONTHLY-" + new Array(31).fill(false).map(x => x ? 1 : 0).join(""));
        });
        it('is due today if never completed and today is a scheduled day', () => {
            const today = moment().date(); // Get today\'s day of the month
            const repeatDays = new Array(31).fill(false);
            repeatDays[today - 1] = true; // Set today as a scheduled day

            const task = {
                lastCompleted: [],
                repeats: "MONTHLY-" + repeatDays.map(x => x ? 1 : 0).join("")
            };
            expect(Task.calculateScheduledTime(task)).toEqual(moment().startOf("day").toISOString());
            expect(Task.dueToday(task)).toBeTruthy();
        });
        it('is due in the past if never completed and there is a repeat time between creation and now', () => {
            const task = Task.createTask("id")
                .thatRepeats("MONTHLY")
                .thatRepeatsOn(new Array(31).fill(0).map((_, i) => i === 1 ? 1 : 0)) // Set the 2nd day of the month
                .scheduledFor(moment("2023-01-01").startOf("day").toISOString())
                .createdAt(moment("2023-01-01").startOf("day").toISOString())
                .build();

            expect(Task.calculateScheduledTime(task, moment().month(1).day(3)))
                .toEqual(moment("2023-01-02").startOf("day").toISOString());
        });
        it('is not due today if today is not a scheduled day', () => {
            const today = moment().date(); // Get today\'s day of the month
            const repeatDays = new Array(31).fill(false);

            const task = {
                lastCompleted: [],
                repeats: "MONTHLY-" + repeatDays.map(x => x ? 1 : 0).join("")
            };

            expect(Task.dueToday(task)).toBeFalsy();
        });
        it('is not due today if last completed is today', () => {
            const today = moment().date(); // Get today\'s day of the month
            const repeatDays = new Array(31).fill(false);
            repeatDays[today - 1] = true; // Set today as a scheduled day

            const task = {
                lastCompleted: [moment().toISOString()],
                repeats: "MONTHLY-" + repeatDays.map(x => x ? 1 : 0).join("")
            };

            expect(Task.dueToday(task)).toBeFalsy();
        });
        it('is due today if last completed is in the past and today is a scheduled day', () => {
            const today = moment().date(); // Get today\'s day of the month
            const repeatDays = new Array(31).fill(false);
            repeatDays[today - 1] = true; // Set today as a scheduled day

            const task = {
                lastCompleted: [moment().subtract(1, "month").toISOString()],
                repeats: "MONTHLY-" + repeatDays.map(x => x ? 1 : 0).join("")
            };

            expect(Task.dueToday(task)).toBeTruthy();
        });
        it('is due on the last day of the month if scheduled for day that does not exist in month', () => {
            const task = Task.createTask("").thatRepeats("MONTHLY").thatRepeatsOn(new Array(30).fill(0).concat([1]))
                .createdAt(moment("2025-02-01").startOf("day").toISOString())
                .build();
            expect(Task.calculateScheduledTime(task, moment("2025-2-28", "YYYY-MM-DD").startOf("day")))
                .toEqual(moment("2025-2-28", "YYYY-MM-DD").startOf("day").toISOString());
        });
        it('was completed in the past and is due on another day before today', () => {
            const task = Task.createTask("id")
                .thatRepeats("MONTHLY")
                .thatRepeatsOn(new Array(31).fill(0).map((_, i) => i === 1 ? 1 : 0)) // Set the 2nd day of the month
                .wasLastCompleted([moment("2023-01-01").startOf("day").toISOString()])
                .createdAt(moment("2023-01-01").startOf("day").toISOString())
                .build();
            expect(Task.calculateScheduledTime(task, moment("2023-01-03").startOf("day"))).toEqual(moment("2023-01-02").startOf("day").toISOString());
        });
        it('was completed in the past and the next repeat is in the past', () => {
            const task = Task.createTask("id")
                .createdAt(moment("2023-01-01").startOf("day").toISOString())
                .thatRepeats("MONTHLY")
                .thatRepeatsOn([0, 1, 1].concat(new Array(28).fill(0))).build();

            const now = moment("2023-01-03").startOf("day");

            expect(Task.calculateScheduledTime(task, now)).toEqual(moment("2023-01-02").startOf("day").toISOString());
        });
        it.each(new Array(31).fill(1))("can define the days of the month for repeating", x => {
            const task = Task.createTask("").thatRepeats("monthly").thatRepeatsOn(new Array(31).fill(0).map((_, i) => i === x ? 1 : 0)).build();
            expect(task.repeats.split("-")[1].split("").map(x => Number.parseInt(x)))
                .toEqual(new Array(31).fill(0).map((_, i) => i === x ? 1 : 0));
        });
    });
});