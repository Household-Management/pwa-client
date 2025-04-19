import {
    Divider,
    List,
    ListItem,
    ListItemButton, ListSubheader,
    Paper, TextField,
} from "@mui/material";
import {AddCircleOutline, Delete, Done, Edit} from "@mui/icons-material";
import {Fragment, useEffect, useRef, useState} from "react";
import TaskDetailAccordion from "./TaskDetailAccordion";
import PropTypes from "prop-types";
import Fab from "@mui/material/Fab";
import {useNavigate, useParams} from "react-router-dom";
import Guarded from "../../authentication/components/Guarded";
import {useSelector} from "react-redux";

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

    const onTaskSelected = (id) => {
        navigate("/tasks/" + props.list.id + "/task/" + id);
    }

    return <TaskListDetailPresentation {...props} user={user} onTaskSelected={onTaskSelected} selectedTaskId={selectedTaskId}/>
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
                                               selectedTaskId
                                           }) {
    const [editing, setEditing] = useState(false);
    const [editableTaskId, setEditableTaskId] = useState(null);

    const toggleEditableTask = (id) => {
        setEditableTaskId(id);
    }

    return <Fragment>
        <Paper sx={{height: "100%"}}>
            <List>
                <ListSubheader sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                    <TextField sx={{width: "75%"}}
                               value={list.name}
                               placeholder="New List"
                               onChange={ev => onListChanged({...list, name: ev.target.value})}
                               disabled={list.unremovable || !editing}
                    />
                    {!list.unremovable && <div style={{flexGrow: 1, display: "flex", justifyContent: "space-evenly"}}>
                        <Fab color="primary" onClick={() => setEditing(!editing)}>
                            {editing ? <Done/> : <Edit/>}
                        </Fab>
                        <Fab color="error" onClick={onListDelete.bind(null, list.id)}
                             sx={{visibility: editing ? "visible" : "hidden"}}>
                            <Delete/>
                        </Fab>
                    </div>}
                </ListSubheader>
                <TaskListItems taskItems={list.taskItems.filter(task => !task.completed)}
                               onTaskSelected={onTaskSelected}
                               onTaskChanged={onTaskChanged}
                               onTaskDelete={onTaskDelete}
                               selectedTaskId={selectedTaskId}
                               editableTaskId={editableTaskId}
                               onTaskEditable={toggleEditableTask}
                />
                <Divider/>
                <TaskListItems taskItems={list.taskItems.filter(task => task.completed)}
                               onTaskSelected={onTaskSelected}
                               onTaskChanged={onTaskChanged}
                               onTaskDelete={onTaskDelete}
                               selectedTaskId={selectedTaskId}
                               editableTaskId={editableTaskId}
                               onTaskEditable={toggleEditableTask}
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
                                   editableTaskId={editableTaskId}
                                   onTaskEditable={toggleEditableTask}
                    />
                </Guarded>
            </List>
        </Paper>
    </Fragment>
}

function TaskListItems({taskItems, selectedTaskId, editableTaskId, onTaskSelected, onTaskChanged, onTaskEditable, onTaskDelete}) {
    return taskItems.map(task => (<ListItem>
        <TaskDetailAccordion task={task}
                             onChange={onTaskChanged}
                             onDelete={onTaskDelete}
                             onToggle={selected => selected ? onTaskSelected(task.id) : onTaskSelected(null)}
                             sx={{width: "100%"}}
                             editable={task.id === editableTaskId}
                             onToggleEditable={onTaskEditable}
                             expanded={selectedTaskId === task.id}
        />
    </ListItem>));
}

TaskListDetail.propTypes = {
    list: PropTypes.object.isRequired,
    onTaskChanged: PropTypes.func.isRequired,
    onTaskSelected: PropTypes.func.isRequired,
    onListDelete: PropTypes.func.isRequired,
    selectedTaskId: PropTypes.string
}