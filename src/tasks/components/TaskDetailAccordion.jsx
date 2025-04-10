import {ModelPropTypes} from "../model/Task";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {Delete, ExpandMore, Edit, Done, CheckCircle} from '@mui/icons-material';
import DayPicker from "../../time/components/DayPicker";
import {
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    styled,
    TextField
} from "@mui/material";
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
// TODO: When name changes, wait until the user stops typing for 1 second before updating the model.
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

    const onRepeatChanged = (ev) => {
        const value = ev.target.value;
        const changed = {...task}
        switch (value) {
            case "NEVER":
                changed.repeats = "NEVER"
                break;
            case "DAILY":
                changed.repeats = "DAILY";
                break;
            case "WEEKLY":
                changed.repeats = "WEEKLY-0000000";
                break;
            case "MONTHLY":
                changed.repeats = "MONTHLY-" + Array(31).fill(0).join("");
                break;
        }
        if (onChange) {
            onChange(changed);
        } else {
            console.warn("No onChange handler provided, this change event will have no effect.");
        }
    }

    const taskRepeat = getRepeats(task.repeats);
    // I actually just guessed that #f5f5f5 was the right color to match the button hover color and it was.
    return <Accordion expanded={expanded || editable} onChange={(ev, ex) => {
        setEditable(false);
        onToggle(ex)
    }} sx={sx}>
        <AccordionSummary expandIcon={<ExpandMore/>} sx={{":hover": {bgcolor: "#f5f5f5"}}} onKeyUpCapture={e => {
            switch(e.code) {
                case "Enter":
                case "Space":
                    e.preventDefault();
                    break;
            }
        }}>
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
                    <Stack>
                        <FormControl size="medium">
                            <InputLabel id="repeat-select-label">Repeat</InputLabel>
                            <Select value={taskRepeat.repeatsType}
                                    onChange={onRepeatChanged}
                                    label="Repeat"
                                    variant="outlined"
                                    disabled={!editable}
                            >
                            <MenuItem value={"NEVER"}>Never</MenuItem>
                            <MenuItem value={"DAILY"}>Daily</MenuItem>
                            <MenuItem value={"WEEKLY"}>Weekly</MenuItem>
                            <MenuItem value={"MONTHLY"}>Monthly</MenuItem>
                        </Select>
                        </FormControl>
                        {/* FIXME: DayPicker doesn't show days of week*/}
                        {taskRepeat.repeatsOn && <DayPicker days={taskRepeat.repeatsOn} onChange={value => {
                            const changed = {...task};
                            changed.repeats = taskRepeat.repeatsType + "-" + value.map(v => v ? "1" : "0").join("");
                            if (onChange) {
                                onChange(changed);
                            } else {
                                console.warn("No onChange handler provided, this change event will have no effect.");
                            }
                        }
                        } />}
                    </Stack>
                </Grid>
                {/*TODO: Implement scheduling tasks at time */}
            </Grid>
        </AccordionDetails>
    </Accordion>
}

function Summary({task, expanded, editable, onEdit, onDelete, onPropertyChanged, toggleEditable}) {
    expanded = expanded || editable;
    if (!expanded) {
        return (<div style={{flexGrow: 1}}>{task.title}</div>);
    }
    if (expanded) {
        if (editable) {
            return <Grid container>
                <Grid item sx={{flexGrow: 1}}>
                    <TextField value={task.title}
                               sx={{width: "100%"}}
                               label="Title"
                               onChange={e => {
                                   onPropertyChanged("title", e);
                               }}
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
                <div style={{flexGrow: 1}}>
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

function getRepeats(repeatValue) {
    const tokens = repeatValue.split("-");
    switch (tokens[0]) {
        case "NEVER":
        case "DAILY":
            return {"repeatsType" : tokens[0] };
        case "WEEKLY":
        case "MONTHLY":
            return {"repeatsType" : tokens[0], repeatsOn: tokens[1].split("").map(t => Number.parseInt(t))}
    }
}

TaskDetailAccordion.propTypes = {
    task: ModelPropTypes.isRequired,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    onToggle: PropTypes.func
}