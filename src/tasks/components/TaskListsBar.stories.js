import TaskListsBar from "./TaskListsBar";
import {userEvent, within, fn} from "@storybook/test";
import {useState} from "react";

export default {
    component: TaskListsBar,
    render: args => {
        const [selectedList, setSelectedList] = useState("1");
        const onSelect = selected => {
            setSelectedList(selected);
            args.onSelect(selected);
        }
        return <TaskListsBar taskLists={args.taskLists} selectedList={selectedList} onNewList={args.onNewList} onSelect={onSelect}/>
    }
}

export const TaskListsBarStory = {
    args: {
        taskLists: {
            "1": {
                name: "Your First List"
            },
            "2": {
                name: "Your Second List"
            },
            "3": {
                name: "Your Third List"
            }
        },
        onNewList: fn(),
        onSelect: fn()
    }
}