import {ModelPropTypes} from "../model/Task";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {ExpandMore} from '@mui/icons-material';
import DayPicker from "../../time/components/DayPicker";
import {FormControl, Grid, MenuItem, Select, Stack, TextField} from "@mui/material";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider, TimeClock, TimePicker} from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import {useState} from "react";
import {RepeatDaily, RepeatWeekly, RepeatMonthly} from "../model/Task";
import moment from "moment";

// TODO: Remove hard-coded color values
// TODO: Gray highlight on hover
export default function TaskDetailAccordion({task, onTaskChange, sx, expanded, onToggle}) {
    const onPropertyChanged = (property, ev) => {
        const value = ev.target.value;
        const changed = {...task};
        changed[property] = value;
        if (onTaskChange) {
            onTaskChange(changed);
        }
    }
    const onTimeChanged = (property, value) => {
        const changed = {...task};
        changed[property] = value;
        if (onTaskChange) {
            onTaskChange(changed);
        }
    }
    const onRepeatChanged = (ev) => {
        const value = ev.target.value;
        const changed = {...task}
        switch (value) {
            case "DAILY":
                changed.repeats = RepeatDaily();
                break;
            case "WEEKLY":
                changed.repeats = RepeatWeekly(Array(7).fill(false));
                break;
            case "MONTHLY":
                changed.repeats = RepeatMonthly(Array(31).fill(false));
                break;
        }
        if(onTaskChange) {
            onTaskChange(changed);
        }
    }
    // I actually just guessed that #f5f5f5 was the right color to match the button hover color and it was.
    return <Accordion expanded={expanded} onChange={(ev, ex) => onToggle(ex)} sx={sx}>
        <AccordionSummary expandIcon={<ExpandMore/>} sx={{":hover" : {bgcolor: "#f5f5f5"}}}>
            {expanded && <TextField value={task.title}
                                    label="Title"
                                    onChange={onPropertyChanged.bind(null, "title")}
                                    /*Keeps the accordion from collapsing when we click the input */
                                    onClick={ev => ev.stopPropagation()} />}
            {!expanded && task.title}
        </AccordionSummary>
        <AccordionDetails>
            <Grid container>
                <Grid item>
                    <TextField value={task.description} label="Description"
                               onChange={onPropertyChanged.bind(null, "description")}/>
                </Grid>
                <Grid item>
                    <Stack>
                        Repeats {<FormControl size="small"><Select value={task.repeats.repeatType}
                                                                   onChange={onRepeatChanged}>
                        <MenuItem value={"DAILY"}>Daily</MenuItem>
                        <MenuItem value={"WEEKLY"}>Weekly</MenuItem>
                        <MenuItem value={"MONTHLY"}>Monthly</MenuItem>
                    </Select></FormControl>} {/* TODO: Implement switching repeat type */}
                        <DayPicker days={task.repeats.repeatOn}/>
                    </Stack>
                </Grid>
                <Grid item>
                    <Stack>
                        Scheduled For
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker value={moment(task.scheduledTime)} onChange={onTimeChanged.bind(null, "scheduledTime")}></TimePicker>
                        </LocalizationProvider>
                    </Stack>
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>
}

TaskDetailAccordion.propTypes = {
    task: ModelPropTypes.isRequired,
    onTaskChange: PropTypes.func,
    readOnly: PropTypes.bool,
    onToggle: PropTypes.func
}