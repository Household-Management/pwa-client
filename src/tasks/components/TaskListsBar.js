import {Box, Button, Container, Dialog, DialogTitle, IconButton, Input, TextField} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import PropTypes from "prop-types";

/**
 * Component for displaying the summarized list of all users to-do lists.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function TaskListsBar(props) {
    const lists = props.taskLists ? Object.keys(props.taskLists) : [];
    const displayedTab = Math.max(0, lists.findIndex(id => id === props.selectedList));
    return <Box style={{width: "100%"}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider', display: "flex", flexDirection: "row"}}>
            <IconButton variant="contained" color="primary" data-testId="new-list" onClick={props.onListCreated}>
                <AddIcon/>
            </IconButton>
            <Tabs value={displayedTab} variant="scrollable" style={{width: "100%"}}>
                {
                    lists.map(listId => TaskTab(props.taskLists[listId], props.onSelect.bind(null, listId)))
                }
            </Tabs>
        </Box>
    </Box>

}

function TaskTab(list, onClick) {
    return <Tab key={list.id} label={list.name} onClick={onClick}>
        {JSON.stringify(list)}
    </Tab>
}

TaskListsBar.propTypes = {
    taskLists: PropTypes.object.isRequired,
    selectedList: PropTypes.string.isRequired,
    onListCreated: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
}

export default TaskListsBar;