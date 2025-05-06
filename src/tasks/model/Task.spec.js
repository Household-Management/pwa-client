import Task, {RepeatMonthly} from "./Task";
import moment from "moment";

describe('Task', () => {
    it('must have a title', () => {
        expect(() => {
            new Task("id", null, "description")
        }).toThrow();
    });
    it('must have a description', () => {
        expect(() => {
            new Task("id", "title", null)
        }).toThrow();
    });
    it('must have an id', () => {
        expect(() => {
            new Task(null, "title", "description");
        }).toThrow();
    });
    describe("which repeats never", () => {
       it("is always due today", () => {
            expect(Task.dueToday({
                lastCompleted: [],
                repeats: "NEVER"
            })).toBeTruthy();
        });
       it("is scheduled for the start of the day it was created", () => {
           const task = Task.createTask("").repeats("NEVER").build();
          expect(Task.calculateScheduledTime(task)).toEqual(moment().startOf("day").toISOString());
       });
    });
    describe("which repeats daily", () => {
        it('has a value of `DAILY`', () => {
            const task = Task.createTask("id").repeats("daily").build();
            expect(task.repeats).toBe("DAILY");
        });
        it('is due today if never completed', () => {
            const task = {
                lastCompleted: [],
                repeats: "DAILY",
                scheduledTime: moment().startOf("day").toISOString()
            };
            expect(Task.calculateScheduledTime(task)).toEqual(moment().startOf("day").toISOString());
            expect(Task.dueToday(task)).toBeTruthy();
        });
        it('is due today if last completed in the past', () => {
            const task = Task.createTask("").repeats("DAILY")
                .wasLastCompleted([moment().startOf("day").subtract(1, "day").toISOString()])
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
            const task = Task.createTask("id").repeats("DAILY");
            task.lastCompleted = [moment()];
            expect(Task.calculateScheduledTime(task)).toEqual(moment().startOf("day")
                .add(1, "days")
                .toISOString());
        });
    });
    describe('which repeats weekly', () => {
        it('has a value of `WEEKLY`', () => {
            const task = Task.createTask("id").repeats("WEEKLY").build();
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
        it('is not due today if last completed is today', () => {
            const task = {
                lastCompleted: [moment().toISOString()],
                repeats: "WEEKLY-1000000"
            };

            const now = moment().day(0).set("hour", 0).set("minute", 0).set("second", 0);

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
    });
    describe('which repeats monthly', () => {
        it('has a value of `MONTHLY`', () => {
            const task = Task.createTask("id").repeats("MONTHLY").build();
            expect(task.repeats).toBe("MONTHLY-" + new Array(31).fill(0).join(""));
        });
        it('has a value of `MONTHLY` with all days set to false', () => {
            const task = Task.createTask("id").repeats("MONTHLY").build();
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

            expect(Task.dueToday(task)).toBeTruthy();
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

        it('throws an error if repeat days array is invalid', () => {
            expect(() => {
                RepeatMonthly(new Array(32).fill(false)); // Invalid array length
            }).toThrow("Repeat days must be an array of no more than 31 and no less than 28 booleans, one for each day of the month.");
        });
    });
});