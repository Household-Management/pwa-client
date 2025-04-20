import {ListItem} from "@mui/material";
import TaskDetailAccordion from "./TaskDetailAccordion";
import PropTypes from "prop-types";

export default function TaskListItems({
                           taskItems,
                           selectedTaskId,
                           onTaskSelected,
                           onTaskChanged,
                           onToggleTaskEditing,
                           onTaskDelete,
                           taskBeingEdited
                       }) {
    return taskItems.map(task => (<ListItem>
        <TaskDetailAccordion task={task}
                             onChange={onTaskChanged}
                             onDelete={onTaskDelete}
                             onToggle={selected => selected ? onTaskSelected(task.id) : onTaskSelected(null)}
                             sx={{width: "100%"}}
                             editable={task.id === taskBeingEdited}
                             onToggleEditable={onToggleTaskEditing}
                             expanded={selectedTaskId === task.id}
        />
    </ListItem>));
}

TaskListItems.propTypes = {
    taskItems: PropTypes.array.isRequired,
    selectedTaskId: PropTypes.string.isRequired,
    onTaskSelected: PropTypes.func.isRequired,
    onTaskChanged: PropTypes.func.isRequired,
    onToggleTaskEditing: PropTypes.func.isRequired,
    onTaskDelete: PropTypes.func.isRequired,
    taskBeingEdited: PropTypes.string,
}