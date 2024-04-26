import {
    Box,
    List,
    ListItem,
    ListItemButton, ListSubheader,
    Paper,
} from "@mui/material";
import {AddCircleOutline, AddCircleOutlined} from "@mui/icons-material";
import {Fragment, useState} from "react";
import TaskDetailAccordion from "./TaskDetailAccordion";
import PropTypes from "prop-types";

/**
 * Component for displaying the detailed view of a TaskList model instance.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
// TODO: Edit name of list
export default function TaskListDetail({list, onTaskChanged, onTaskCreated, onTaskSelected, selectedTask}) {
    return <Fragment>
        <Paper sx={{height: "100%"}}>
            <List >
                <ListSubheader>
                    {list.name}
                </ListSubheader>
                {/* FIXME: Make a nice header */}
                {list.tasks.map(task =>
                    <ListItem>
                        <TaskDetailAccordion task={task}
                                             onChange={onTaskChanged}
                                             onToggle={selected => selected ? onTaskSelected(task.id) : onTaskSelected(null)}
                                             sx={{width: "100%"}}
                                             expanded={selectedTask === task.id}
                        />
                    </ListItem>
                )}
                <ListItem>
                    <Paper style={{position: "relative", overflowAnchor: "none", width: "100%"}}>
                            <ListItemButton style={{flexGrow: 1, display: "flex"}} onClick={onTaskCreated}>
                                <AddCircleOutline/>New Task
                            </ListItemButton>
                    </Paper>
                </ListItem>
            </List>
        </Paper>
    </Fragment>
}

TaskListDetail.propTypes = {
    list: PropTypes.array.isRequired,
    onTaskChanged: PropTypes.func,
    onTaskSelected: PropTypes.func
}