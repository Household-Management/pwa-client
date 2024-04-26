import { fn, spyOn } from '@storybook/test';
import TaskDetailAccordion from "./TaskDetailAccordion";
import {RepeatDaily, RepeatWeekly, RepeatMonthly} from "../model/Task";
import moment from "moment/moment";
import { useState } from "react";

export default {
    render: story => {
        const [task, setTask] = useState(story.task);
        const onChange = (changed) => {
            setTask(changed)
            story.onChange(changed)
        }
        return <TaskDetailAccordion task={task} onChange={onChange} />
    },
    args: {
        onChange: fn()
    }
}

export const DailyTaskDetailAccordionStories = {
    args: {
        task: {
            id: "1",
            title: "Daily Task",
            description: "Description",
            repeats: RepeatDaily(),
            scheduledTime: moment().set({minute: 0, hour: 12}),
        }
    }
}

export const WeeklyTaskDetailAccordionStories = {
    args: {
        task: {
            id: "2",
            title: "Weekly Task",
            description: "Description",
            repeats: RepeatWeekly([false, true, false, true, false, true, false]),
            scheduledTime: moment().set({minute: 0, hour: 12}),
        }
    }
}

export const MonthlyTaskDetailAccordionStories = {
    args: {
        task: {
            id: "3",
            title: "Monthly Task",
            description: "Description",
            repeats: RepeatMonthly(Array(31).fill(false)),
            scheduledTime: moment().set({minute: 0, hour: 12}),
        }
    }
}