import {
    Divider,
    List,
    ListItem,
    ListItemButton, ListSubheader,
    Paper, TextField,
} from "@mui/material";
import {AddCircleOutline, Delete, Done, Edit} from "@mui/icons-material";
import {Fragment, useState} from "react";
import PropTypes from "prop-types";
import Guarded from "../../authorization/Guarded";
import TaskListHeader from "./TaskListHeader";
import TaskListItems from "./TaskListItems";
import Task from "../model/Task";

/**
 * Component for displaying the detailed view of a TaskList model instance.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */

// TODO: Show all tasks to admins.
export default function TaskListDetail({
                                           list,
                                           onTaskChanged,
                                           onTaskCreated,
                                           onTaskSelected,
                                           onListChanged,
                                           onListDelete,
                                           onTaskDelete,
                                           selectedTaskId,
                                       }) {
    const [taskBeingEdited, setTaskBeingEdited] = useState(null);

    const taskSelected = (id, toggled) => {
        onTaskSelected(id, toggled);
        setTaskBeingEdited(null);
    }

    const onToggleTaskEditing = (taskId, editing) => {
        setTaskBeingEdited(editing ? taskId : null);
        if(selectedTaskId !== taskId) {
            taskSelected(taskId, editing);
        }
    }

    const [listEditing, setListEditing] = useState(false);

    // TODO: Filtering for weekly and monthly tasks.
    const dueTasks = list.taskItems.filter(Task.dueToday);
    const completedTasks = list.taskItems.filter(pipe([Task.dueToday, not(completed)]));

    return <Paper sx={{flexGrow: 1}}>
            <List>
                <TaskListHeader
                    list={list}
                    editing={listEditing}
                    toggleEditing={editing => setListEditing(editing)}
                    onListChanged={onListChanged}
                    onListDelete={onListDelete}
                />
                <ListItem>
                    <Paper style={{position: "relative", overflowAnchor: "none", width: "100%"}}>
                        <ListItemButton style={{flexGrow: 1, display: "flex"}} onClick={() => onTaskCreated(id => {
                            setTaskBeingEdited(id);
                        })}>
                            <AddCircleOutline/>New Task
                        </ListItemButton>
                    </Paper>
                </ListItem>
                <Divider/>
                <ListSubheader>
                    Due Tasks ({dueTasks.length})
                </ListSubheader>
                <TaskListItems taskItems={dueTasks}
                               onTaskSelected={taskSelected}
                               onTaskChanged={onTaskChanged}
                               onTaskDelete={onTaskDelete}
                               selectedTaskId={selectedTaskId}
                               onToggleTaskEditing={onToggleTaskEditing}
                               taskBeingEdited={taskBeingEdited}
                />
                <Divider/>
                <ListSubheader>
                    Completed Tasks ({completedTasks.length})
                </ListSubheader>
                <TaskListItems taskItems={completedTasks}
                               onTaskSelected={taskSelected}
                               onTaskChanged={onTaskChanged}
                               onTaskDelete={onTaskDelete}
                               selectedTaskId={selectedTaskId}
                               onToggleTaskEditing={onToggleTaskEditing}
                               taskBeingEdited={taskBeingEdited}
                />
                <Divider/>
                <Guarded requiredRoles={["admin"]}>
                    <ListSubheader>
                        All Tasks ({list.taskItems.length})
                    </ListSubheader>
                    <TaskListItems taskItems={list.taskItems}
                                   onTaskChanged={onTaskChanged}
                                   onTaskDelete={onTaskDelete}
                                   selectedTaskId={selectedTaskId}
                                   onTaskSelected={taskSelected}
                                   onToggleTaskEditing={onToggleTaskEditing}
                                   taskBeingEdited={taskBeingEdited}
                    />
                </Guarded>
            </List>
        </Paper>
}

TaskListDetail.propTypes = {
    list: PropTypes.object.isRequired,
    onTaskChanged: PropTypes.func.isRequired,
    onTaskCreated: PropTypes.func.isRequired,
    onTaskSelected: PropTypes.func.isRequired,
    onListChanged: PropTypes.func.isRequired,
    onListDelete: PropTypes.func.isRequired,
    onTaskDelete: PropTypes.func.isRequired,
    selectedTaskId: PropTypes.string,
}

function completed(task) {
    return task.completed;
}


function not(filter){
    return (x => !filter(x));
}

function pipe(fns) {
    return (x) => fns.reduce((v, f) => f(v), x);
}