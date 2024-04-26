import {fn, spyOn} from '@storybook/test';
import TaskListDetail from "./TaskListDetail";
import Task from "../model/Task";
import {useState} from "react";

export default {
    render: args => {
        const [list, setList] = useState(args.list);
        const [selectedTask, setSelectedTask] = useState(args.selectedTask);
        const onTaskChanged = task => {
            console.log("Task changed: ", task);
            const index = list.tasks.findIndex(t => t.id === task.id);
            list.tasks[index] = task;
            setList({...list});
            args.onTaskChanged({...list})
        }
        const onTaskCreated = () => {
            const newTask = new Task(crypto.randomUUID(), "New Task", "New Description");
            list.tasks.push(newTask);
            setList({...list});
            args.onTaskCreated(newTask);
            setSelectedTask(newTask.id);
        }
        const onTaskSelected = (id) => {
            setSelectedTask(id);
            args.onTaskSelected(id);
        }
        return <TaskListDetail list={list} onTaskChanged={onTaskChanged} onTaskCreated={onTaskCreated} onTaskSelected={onTaskSelected} selectedTask={selectedTask} />
    }
}

export const TaskListDetailStory = {
    args: {
        list: {
            id: "1",
            name: "List 1",
            tasks: [
                new Task("1", "Task 1", "Description 1"),
                new Task("2", "Task 2", "Description 2"),
                new Task("3", "Task 3", "Description 3")
            ]
        },
        selectedTask: null,
        onClose: fn(),
        onConfirm: fn(),
        onCancel: fn(),
        onTaskChanged: fn(),
        onTaskCreated: fn(),
        onTaskSelected: fn()
    }
}