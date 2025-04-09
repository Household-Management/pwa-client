import {fn} from '@storybook/test';
import DayPicker from "./DayPicker";
import React, {useState} from "react";

export default {
    render: (args) => {
        const [days, setDays] = useState(args.days);
        const onChange = (values) => {
            setDays(values);
        }
        return <DayPicker onChange={onChange} readOnly={args.readOnly} days={days} dayNames={args.dayNames}/>
    },
    args: {
        onChange: fn()
    }
}

export const DayOfWeekPickerStory = {
    args: {
        days: [0, 0, 0, 1, 0, 0, 0],
        dayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
}

export const ReadOnlyDayOfWeekPickerStory = {
    args: {
        days: [0, 0, 0, 1, 0, 0, 0],
        dayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        readOnly: true
    }
}

export const DayOfMonthStory = {
    render: args => {
        // Does it matter in test code?
        const monthDays = {
            0: Array(31).fill(0),
            1: Array(28).fill(0),
            2: Array(31).fill(0),
            3: Array(30).fill(0),
            4: Array(31).fill(0),
            5: Array(30).fill(0),
            6: Array(31).fill(0),
            7: Array(31).fill(0),
            8: Array(30).fill(0),
            9: Array(31).fill(0),
            10: Array(30).fill(0),
            11: Array(31).fill(0)
        }
        const [days, setDays] = useState(monthDays[0]);
        console.log(monthDays)
        const [month, setMonth] = useState(0);
        const onChange = (values) => {
            setDays(values);
            args.onChange(values)
        }
        return <div>
            <select value={month} onChange={e => {setMonth(e.target.value); setDays([...monthDays[e.target.value]])}} >
                <option value={0}>January</option>
                <option value={1}>February</option>
                <option value={2}>March</option>
                <option value={3}>April</option>
                <option value={4}>May</option>
                <option value={5}>June</option>
                <option value={6}>July</option>
                <option value={7}>August</option>
                <option value={8}>September</option>
                <option value={9}>October</option>
                <option value={10}>November</option>
                <option value={11}>December</option>
            </select>
            <DayPicker onChange={onChange} readOnly={args.readOnly} days={days} dayNames={days.map((x, i) => (i + 1).toString())}/>
        </div>
    }
}