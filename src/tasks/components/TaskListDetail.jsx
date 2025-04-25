import {
    Divider,
    List,
    ListItem,
    ListItemButton, ListSubheader,
    Paper, TextField,
} from "@mui/material";
import {AddCircleOutline, Delete, Done, Edit} from "@mui/icons-material";
import {Fragment, useState} from "react";
import TaskDetailAccordion from "./TaskDetailAccordion";
import PropTypes from "prop-types";
import Fab from "@mui/material/Fab";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import Guarded from "../../authentication/components/Guarded";
import {useSelector} from "react-redux";
import TaskListHeader from "./TaskListHeader";
import TaskListItems from "./TaskListItems";
import moment from "moment";

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
    }

    const onToggleTaskEditing = (taskId, editing) => {
        setTaskBeingEdited(editing ? taskId : null);
        if(selectedTaskId !== taskId) {
            taskSelected(taskId, editing);
        }
    }

    const [listEditing, setListEditing] = useState(false);

    const dueTasks = list.taskItems.filter(task => !task.completed && moment().diff(moment(task.scheduledTime, 'days')) <= 0);

    return <Fragment>
        <Paper sx={{height: "100%"}}>
            <List>
                <TaskListHeader
                    list={list}
                    editing={listEditing}
                    toggleEditing={editing => setListEditing(editing)}
                    onListChanged={onListChanged}
                    onListDelete={onListDelete}
                />
                <ListSubheader>
                    Due Tasks
                </ListSubheader>
                <TaskListItems taskItems={dueTasks}
                               onTaskSelected={onTaskSelected}
                               onTaskChanged={onTaskChanged}
                               onTaskDelete={onTaskDelete}
                               selectedTaskId={selectedTaskId}
                               onToggleTaskEditing={onToggleTaskEditing}
                               taskBeingEdited={taskBeingEdited}
                />
                <Divider/>
                <TaskListItems taskItems={list.taskItems.filter(task => task.completed)}
                               onTaskSelected={onTaskSelected}
                               onTaskChanged={onTaskChanged}
                               onTaskDelete={onTaskDelete}
                               selectedTaskId={selectedTaskId}
                               onToggleTaskEditing={onToggleTaskEditing}
                               taskBeingEdited={taskBeingEdited}
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

                <Guarded requiredRoles={["admin"]}>
                    <ListSubheader>
                        All Tasks
                    </ListSubheader>
                    <TaskListItems taskItems={list.taskItems}
                                   onTaskChanged={onTaskChanged}
                                   onTaskDelete={onTaskDelete}
                                   selectedTaskId={selectedTaskId}
                                   onTaskSelected={onTaskSelected}
                                   onToggleTaskEditing={onToggleTaskEditing}
                                   taskBeingEdited={taskBeingEdited}
                    />
                </Guarded>
            </List>
        </Paper>
    </Fragment>
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