import TaskStateConfiguration from "./TaskStateConfiguration";

describe("TaskStateConfiguration", () => {
    describe('reducers', () => {
        let client;
        let state;
        beforeEach(() => {
            client = {
                models: {
                    TaskList: {
                        create: jest.fn(),
                        update: jest.fn(),
                        "delete": jest.fn()
                    },
                    Task: {
                        create: jest.fn(),
                        update: jest.fn(),
                        "delete": jest.fn()
                    }
                }
            };
            state = {
                household: {
                    householdTasks: {
                        id: "householdTasksId"
                    }
                }
            };
        });
        it("CreateList persister creates a new task list", () => {
            const prepared = TaskStateConfiguration.actions.CreateList({});
            expect(prepared.meta.persister).toBeDefined();

            prepared.meta.persister(client, state, {
                payload: {
                    name: "foobar"
                }
            });

            expect(client.models.TaskList.create).toHaveBeenCalledWith({
                name: "foobar",
                householdTasksId: "householdTasksId",
            });
        });
        it("CreateTask persister creates a new task in a list", () => {
            const prepared = TaskStateConfiguration.actions.CreateTask({});
            expect(prepared.meta.persister).toBeDefined();

            prepared.meta.persister(client, state, {
                payload: {
                    householdTasksId: "foobar"
                }
            });

            expect(client.models.Task.create).toHaveBeenCalledWith({
                householdTasksId: "foobar",
            });
        });
        it("UpdateList persister updates a task list", () => {
            const prepared = TaskStateConfiguration.actions.UpdateList({});
            expect(prepared.meta.persister).toBeDefined();

            prepared.meta.persister(client, state, {
                payload: {
                    name: "foobar"
                }
            });

            expect(client.models.TaskList.update).toHaveBeenCalledWith({
                name: "foobar",
            });
        });
        it("UpdateTask persister updates a task", () => {
            const prepared = TaskStateConfiguration.actions.UpdateTask({});
            expect(prepared.meta.persister).toBeDefined();

            prepared.meta.persister(client, state, {
                payload: {
                    name: "foobar"
                }
            });

            expect(client.models.Task.update).toHaveBeenCalledWith({
                name: "foobar",
            });
        });
        it("DeleteList persister deletes a task list", () => {
            const prepared = TaskStateConfiguration.actions.DeleteList({});
            expect(prepared.meta.persister).toBeDefined();

            prepared.meta.persister(client, state, {
                payload: "foobar"
            });

            expect(client.models.TaskList.delete).toHaveBeenCalledWith({
                id: "foobar",
            });
        });
        it("DeleteTask persister deletes a task", () => {
            const prepared = TaskStateConfiguration.actions.DeleteTask({});
            expect(prepared.meta.persister).toBeDefined();

            prepared.meta.persister(client, state, {
                payload: "foobar"
            });

            expect(client.models.Task.delete).toHaveBeenCalledWith({
                id: "foobar",
            });
        });
    });
});