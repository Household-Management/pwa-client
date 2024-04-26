export default class TaskList {
    id;
    tasks;
    constructor(id, name, tasks) {
        this.id = id;
        this.name = name;
        if (!Array.isArray(tasks)) {
            throw "Tasks arg must be an array"
        }
        const taskIds = {}
        for(const task in tasks) {
            if(typeof task.id !== "string") {
                throw "Task ids must be strings"
            }
            if(taskIds[task.id]) {
                throw "Multiple tasks with the id " + task.id + " found"
            }
        }
        this.tasks = tasks;
    }
}

// TODO: Add proptypes definition