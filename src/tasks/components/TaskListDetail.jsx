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

/**
 * Component for displaying the detailed view of a TaskList model instance.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */

export default function TaskListDetail(props) {
    const user = useSelector(state => state.user.user);
    const navigate = useNavigate();
    const {taskId: selectedTaskId} = useParams();
    const [searchParams] = useSearchParams();

    const onTaskSelected = (id) => {
        navigate("/tasks/" + props.list.id + "/task/" + id);
    }

    return <TaskListDetailPresentation {...props} user={user} onTaskSelected={onTaskSelected}
                                       selectedTaskId={selectedTaskId}
                                       editing={searchParams.get("edit") === "true"}
    />
}

// TODO: Show all tasks to admins.
export function TaskListDetailPresentation({
                                               list,
                                               user,
                                               onTaskChanged,
                                               onTaskCreated,
                                               onTaskSelected,
                                               onListChanged,
                                               onListDelete,
                                               onTaskDelete,
                                               listEditing,
                                               selectedTaskId,
                                           }) {
    const [taskBeingEdited, setTaskBeingEdited] = useState(null);

    const onToggleTaskEditing = (taskId, editing) => {
        if(editing) {
            setTaskBeingEdited(taskId);
        } else {
            setTaskBeingEdited(null);
        }
    }

    return <Fragment>
        <Paper sx={{height: "100%"}}>
            <List>
                <TaskListHeader
                    list={list}
                    editing={listEditing}
                    toggleEditing={onListChanged}
                    onListChanged={onListChanged}
                    onListDelete={onListDelete}
                />
                <TaskListItems taskItems={list.taskItems.filter(task => !task.completed)}
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
                        <ListItemButton style={{flexGrow: 1, display: "flex"}} onClick={onTaskCreated}>
                            <AddCircleOutline/>New Task
                        </ListItemButton>
                    </Paper>
                </ListItem>

                <Guarded requiredRoles={["admin"]} user={user}>
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


TaskListDetailPresentation.propTypes = {
    list: PropTypes.object.isRequired,
    onTaskChanged: PropTypes.func.isRequired,
    onTaskCreated: PropTypes.func.isRequired,
    onTaskSelected: PropTypes.func.isRequired,
    onListChanged: PropTypes.func.isRequired,
    onListDelete: PropTypes.func.isRequired,
    onTaskDelete: PropTypes.func.isRequired,
    listEditing: PropTypes.bool, // If this list is being editing
    selectedTaskId: PropTypes.string,
}

TaskListDetail.propTypes = {
    list: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onTaskChanged: PropTypes.func.isRequired,
    onTaskCreated: PropTypes.func.isRequired,
    onTaskSelected: PropTypes.func.isRequired,
    onListChanged: PropTypes.func.isRequired,
    onListDelete: PropTypes.func.isRequired,
    onTaskDelete: PropTypes.func.isRequired,
    listEditing: PropTypes.bool, // If this list is being editing
    selectedTaskId: PropTypes.string,
}