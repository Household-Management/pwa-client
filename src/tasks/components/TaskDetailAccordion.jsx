import {ModelPropTypes} from "../model/Task";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {Delete, ExpandMore, Edit, Done, CheckCircle} from '@mui/icons-material';
import DayPicker from "../../time/components/DayPicker";
import {Button, FormControl, Grid, IconButton, MenuItem, Paper, Select, Stack, styled, TextField} from "@mui/material";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider, TimeClock, TimePicker} from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import {Fragment, useState} from "react";
import {RepeatDaily, RepeatWeekly, RepeatMonthly} from "../model/Task";
import moment from "moment";
import IconTile from "../../IconTile";

const repeatLabels = {
    "NEVER": "Never",
    "DAILY": "Daily",
    "WEEKLY": "Weekly",
    "MONTHLY": "Monthly"
}

// TODO: Highlight tasks due today.
// TODO: Implement completion of tasks.
// TODO: Remove hard-coded color values
// TODO: Gray highlight on hover
export default function TaskDetailAccordion({task, onChange, sx, expanded, onToggle, onDelete}) {

    const [editable, setEditable] = useState(false);
    const onPropertyChanged = (property, ev) => {
        const value = ev.target.value;
        const changed = {...task};
        changed[property] = value;
        if (onChange) {
            onChange(changed);
        } else {
            console.warn("No onChange handler provided, this change event will have no effect.");
        }
    }
    const onTimeChanged = (property, value) => {
        const changed = {...task};
        changed[property] = value;
        if (onChange) {
            onChange(changed);
        } else {
            console.warn("No onChange handler provided, this change event will have no effect.");
        }
    }
    const onRepeatChanged = (ev) => {
        const value = ev.target.value;
        const changed = {...task}
        switch (value) {
            case "NEVER":
                changed.repeats = { // FIXME: Move into same as Daily, Weekly, Monthly
                    repeatType: "NEVER",
                    repeatOn: []
                };
                break;
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
        if (onChange) {
            onChange(changed);
        } else {
            console.warn("No onChange handler provided, this change event will have no effect.");
        }
    }
    // I actually just guessed that #f5f5f5 was the right color to match the button hover color and it was.
    return <Accordion expanded={expanded || editable} onChange={(ev, ex) => {
        setEditable(false);
        onToggle(ex)
    }} sx={sx}>
        <AccordionSummary expandIcon={<ExpandMore/>} sx={{":hover": {bgcolor: "#f5f5f5"}}}>
            <Summary task={task}
                     expanded={expanded}
                     editable={editable}
                     onEdit={setEditable}
                     onDelete={onDelete}
                     onPropertyChanged={onPropertyChanged}
                     toggleEditable={setEditable}/>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container rowSpacing={2}>
                <Grid item>
                    <TextField value={task.description} label="Description"
                               disabled={!editable}
                               onChange={onPropertyChanged.bind(null, "description")}/>
                </Grid>
                <Grid item>
                    {editable && <Stack>
                        {<FormControl size="small"><Select value={task.repeats.repeatType}
                                                           onChange={onRepeatChanged}
                                                           label="Repeat">
                            <MenuItem value={"NEVER"}>Never</MenuItem>
                            <MenuItem value={"DAILY"}>Daily</MenuItem>
                            <MenuItem value={"WEEKLY"}>Weekly</MenuItem>
                            <MenuItem value={"MONTHLY"}>Monthly</MenuItem>
                        </Select></FormControl>} {/* TODO: Implement switching repeat type */}
                        {/* FIXME: DayPicker doesn't show days of week*/}
                        {task.repeats && <DayPicker days={task.repeats.repeatOn}/>}
                    </Stack>}
                    {!editable &&
                        <TextField label="Repeat" value={repeatLabels[task.repeats.repeatType]} disabled={true}/>}
                </Grid>
                {/*TODO: Implement scheduling tasks at time */}
                {/*<Grid item>*/}
                {/*    <Stack>*/}
                {/*        Scheduled For*/}
                {/*        <LocalizationProvider dateAdapter={AdapterMoment}>*/}
                {/*            <TimePicker value={moment(task.scheduledTime)} onChange={onTimeChanged.bind(null, "scheduledTime")}></TimePicker>*/}
                {/*        </LocalizationProvider>*/}
                {/*    </Stack>*/}
                {/*</Grid>*/}
                {!editable && <Grid item xs={12}>
                    <Button variant="contained">Complete</Button>
                </Grid>}
            </Grid>
        </AccordionDetails>
    </Accordion>
}

// const IconActionButton = styled(IconButton)(({theme, ...props}) => {
//     return {
//         backgroundColor: theme.palette[props.color].main,
//         color: theme.palette[props.color].contrastText,
//         borderRadius: "50%",
//     }
// });

function Summary({task, expanded, editable, onEdit, onDelete, onPropertyChanged, toggleEditable}) {
    expanded = expanded || editable;
    if (!expanded) {
        return task.title;
    }
    if (expanded) {
        if (editable) {
            return <Grid container>
                <Grid item>
                    <TextField value={task.title}
                               label="Title"
                               onChange={onPropertyChanged.bind(null, "title")}
                        /*Keeps the accordion from collapsing when we click the input */
                               onClick={ev => ev.stopPropagation()}/>
                </Grid>
                <Grid item>
                    <IconTile icon={<Done/>} onClick={ev => {
                        toggleEditable(!editable);
                        ev.stopPropagation()
                    }} color="primary" size="large"/>
                </Grid>
                <Grid item>
                    <IconTile style={{marginLeft: "32px", borderRadius: "50%"}} onClick={ev => {
                        onDelete(task.id);
                        ev.stopPropagation()
                    }} color="error" size="large" icon={<Delete/>} />
                </Grid>
            </Grid>
        } else {
            return <Grid container>
                <div style={{display: "flex", alignItems: "center"}}>
                    {task.title}
                </div>
                <IconTile onClick={ev => {
                    toggleEditable(!editable);
                    ev.stopPropagation()
                }} color="primary" size="large" icon={<Edit/>} />
            </Grid>
        }
    }
}

TaskDetailAccordion.propTypes = {
    task: ModelPropTypes.isRequired,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    onToggle: PropTypes.func
}