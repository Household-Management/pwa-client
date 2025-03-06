import {
    Grid,
    ToggleButton,
    ToggleButtonGroup,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableContainer
} from "@mui/material";
import PropTypes from "prop-types";
import {useState} from "react";

// This has been implemented because I only want to be able to select days of a week or month, out of the box
// solutions allow selecting actual dates.
export default function DayPicker({days, dayNames, readOnly, onChange}) {
    const changeCallback = (i, event) => {
        if (readOnly) return;
        const changed = [...days];
        changed[i] = !(event.target.value === "true");
        if (onChange) {
            onChange(changed);
        }
    }
    const groups = days.reduce((acc, day, i) => {
        const group = Math.floor(i / 7);
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(day);
        return acc;
    }, []);
    return <ToggleButtonGroup>
        <TableContainer>
            <Table>
                <TableBody>
                    {groups.map((group, g) => {
                        return <TableRow>
                            {group.map((day, i) => {
                                const index = g * 7 + i;
                                return <TableCell sx={{padding: 0, width: "50px", height: "50px"}}>
                                    {dayToggle(dayNames && dayNames.length > index ? dayNames[index] : (index + 1).toString(), day, changeCallback.bind(null, index), readOnly)}
                                </TableCell>
                            })}
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </ToggleButtonGroup>
}

DayPicker.propTypes = {
    days: PropTypes.arrayOf(PropTypes.bool).isRequired,
    dayNames: PropTypes.arrayOf(PropTypes.string),
    readOnly: PropTypes.bool,
    onChange: PropTypes.func
}

function dayToggle(day, value, onChange, readonly) {
    return <ToggleButton key={day} value={value === true} selected={value === true}
                         disabled={readonly}
                         onChange={onChange}
                         sx={{
                             width: "100%",
                             height: "100%"
                         }}>{day}</ToggleButton>
}