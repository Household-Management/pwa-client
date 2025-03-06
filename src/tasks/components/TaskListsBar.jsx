import {
    Box,
    IconButton, Stack, ToggleButton,
    ToggleButtonGroup, Toolbar
} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import PropTypes from "prop-types";
import {Link, NavLink} from "react-router-dom";
import {useParams} from "react-router-dom";

/**
 * Component for displaying the summarized list of all users to-do lists.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
// FIXME: Alerts show beneath this header.
function TaskListsBar(props) {
    const lists = props.taskLists ? Object.keys(props.taskLists) : [];
    const displayedTab = Math.max(0, lists.findIndex(id => id === props.selectedList));
    return <div style={{overflowX: "auto"}}>
        <Stack sx={{width: "100%", "justify-content": "flex-start", boxSizing: "border-box"}}
               direction="row">
            <IconButton variant="contained" color="primary" data-testId="new-list" onClick={props.onListCreated}>
                <AddIcon/>
            </IconButton>
            <ToggleButtonGroup value={props.selectedList} exclusive onChange={(e, value) => props.onSelect(value || props.selectedList)}>
                {
                    lists.map(listId => TaskTab(props.taskLists[listId], props.onSelect.bind(null, listId)))
                }
            </ToggleButtonGroup>
        </Stack>
    </div>

}

function TaskTab(list) {
    return <ToggleButton value={list.id}>
        <NavLink to={`/tasks/${list.id}`} className="nav-link">
            <Tab key={list.id} label={list.name || "New List"}>
                {JSON.stringify(list)}
            </Tab>
        </NavLink>
    </ToggleButton>
}

TaskListsBar.propTypes = {
    taskLists: PropTypes.object.isRequired,
    selectedList: PropTypes.string.isRequired,
    onListCreated: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
}

export default TaskListsBar;