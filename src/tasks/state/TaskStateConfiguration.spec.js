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
                        id: "householdTasksId",
                        taskLists: [
                            {
                                id: "foobar",
                            }
                        ]
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

            client.models.TaskList.update.mockReturnValueOnce({});
            prepared.meta.persister(client, state, {
                payload: {
                    targetList: "foobar",
                }
            });

            expect(client.models.TaskList.update).toHaveBeenCalledWith({
                id: "foobar",
            });
        });
        it("UpdateList persister updates a task list", () => {
            const prepared = TaskStateConfiguration.actions.UpdateList({});
            expect(prepared.meta.persister).toBeDefined();

            client.models.TaskList.update.mockReturnValueOnce({});

            prepared.meta.persister(client, state, {
                payload: {
                    id: "foobar"
                }
            });

            expect(client.models.TaskList.update).toHaveBeenCalledWith({
                id: "foobar",
            });
        });
        it("UpdateTask persister updates a task", () => {
            const prepared = TaskStateConfiguration.actions.UpdateTask({});
            expect(prepared.meta.persister).toBeDefined();
            client.models.TaskList.update.mockReturnValueOnce({});

            prepared.meta.persister(client, state, {
                payload: {
                    targetList: "foobar"
                }
            });

            expect(client.models.TaskList.update).toHaveBeenCalledWith({
                id: "foobar",
            });
        });
        it("DeleteList persister deletes a task list", () => {
            const prepared = TaskStateConfiguration.actions.DeleteList({});
            expect(prepared.meta.persister).toBeDefined();

            prepared.meta.persister(client, state, {
                payload: {taskId: "foobar"}
            });

            expect(client.models.TaskList.delete).toHaveBeenCalledWith({
                id: "foobar",
            });
        });
        it("DeleteTask persister deletes a task", () => {
            const prepared = TaskStateConfiguration.actions.DeleteTask({});
            expect(prepared.meta.persister).toBeDefined();

            client.models.TaskList.update.mockReturnValueOnce({
                id: "foobar",
            });
            prepared.meta.persister(client, state, {
                payload: {targetList: "foobar"}
            });

            expect(client.models.TaskList.update).toHaveBeenCalledWith({
                id: "foobar",
            });
        });
    });
});