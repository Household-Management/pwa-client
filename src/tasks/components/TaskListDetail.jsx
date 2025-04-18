import {
    Divider,
    List,
    ListItem,
    ListItemButton, ListSubheader,
    Paper, TextField,
} from "@mui/material";
import {AddCircleOutline, Delete, Done, Edit, HorizontalRule} from "@mui/icons-material";
import {Fragment, useEffect, useRef, useState} from "react";
import TaskDetailAccordion from "./TaskDetailAccordion";
import PropTypes from "prop-types";
import Fab from "@mui/material/Fab";
import {useParams} from "react-router-dom";

/**
 * Component for displaying the detailed view of a TaskList model instance.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function TaskListDetail({list, onTaskChanged, onTaskCreated, onTaskSelected, onListChanged, onListDelete, onTaskDelete, selectedTask}) {
    const [editing, setEditing] = useState(false);
    const { taskId: selectedTaskId } = useParams();

    const textFieldRef = useRef(null);

    useEffect(() => {
        if(editing && textFieldRef.current) {
            textFieldRef.current.focus();
        }
    }, [editing]);

    return <Fragment>
        <Paper sx={{height: "100%"}}>
            <List >
                <ListSubheader sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                    <TextField sx={{width: "75%"}}
                               value={list.name}
                               placeholder="New List"
                               onChange={ev => onListChanged({...list, name: ev.target.value})}
                               disabled={list.unremovable || !editing}
                               inputRef={textFieldRef}
                    />
                    {!list.unremovable && <div style={{flexGrow: 1, display: "flex", justifyContent: "space-evenly"}}>
                        <Fab color="primary" onClick={() => setEditing(!editing)}>
                            {editing ? <Done/> : <Edit/>}
                        </Fab>
                        <Fab color="error" onClick={onListDelete.bind(null, list.id)} sx={{visibility: editing? "visible" : "hidden"}} >
                            <Delete/>
                        </Fab>
                    </div>}
                </ListSubheader>
                {/* FIXME: Make a nice header */}
                {list.taskItems.filter(task => !task.completed).map(task =>
                    <ListItem>
                        <TaskDetailAccordion task={task}
                                             onChange={onTaskChanged}
                                             onDelete={onTaskDelete}
                                             onToggle={selected => selected ? onTaskSelected(task.id) : onTaskSelected(null)}
                                             sx={{width: "100%"}}
                                             expanded={selectedTaskId === task.id}
                        />
                    </ListItem>
                )}
                <Divider/>
                {list.taskItems.filter(task => task.completed).map(task =>
                    <ListItem>
                        <TaskDetailAccordion task={task}
                                             onChange={onTaskChanged}
                                             onDelete={onTaskDelete}
                                             onToggle={selected => selected ? onTaskSelected(task.id) : onTaskSelected(null)}
                                             sx={{width: "100%", backgroundColor: "whitesmoke"}}
                                             expanded={selectedTaskId === task.id}
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
    list: PropTypes.object.isRequired,
    onTaskChanged: PropTypes.func.isRequired,
    onTaskSelected: PropTypes.func.isRequired,
    onListDelete: PropTypes.func.isRequired
}