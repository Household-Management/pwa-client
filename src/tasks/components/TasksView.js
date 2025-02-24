import TaskListsBar from "./TaskListsBar";
import {Fragment, useEffect} from "react";

import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getActions} from "../state/TaskStateConfiguration";
import TaskListDetail from "./TaskListDetail";
import Task from "../model/Task";
import {useHeader} from "../../layout/hooks/HeaderContext";

/**
 * Top-level container for all user tasks ui elements.
 * @constructor
 */
// TODO: Check for if a task is being edited when trying to open another one?
// TODO: Handle deleting lists and tasks.
export function TasksView({taskLists, selectedList, dispatch, ...props}) {
    const { setHeaderContent } = useHeader()

    useEffect(() => {
        setHeaderContent(<TaskListsBar taskLists={taskLists}
                                       onSelect={sel => dispatch(getActions().SelectList(sel))}
                                       selectedList={selectedList}
                                       onListCreated={() => {
                                           const newList = {id: crypto.randomUUID(), name: "New List", tasks: []};
                                           dispatch(getActions().CreateList(newList));
                                           dispatch(getActions().SelectList(newList.id));
                                       }}
        />)
    }, [taskLists, selectedList]);

    return <Fragment>
        {selectedList && taskLists[selectedList] &&
            <TaskListDetail list={taskLists[selectedList]}
                            selectedTask={props.selectedTask}
                            onTaskSelected={(task) => dispatch(getActions().SelectTask(task))}
                            onTaskCreated={() => {
                                const task = new Task(crypto.randomUUID(), "New Task", "");
                                dispatch(getActions().CreateTask({
                                    targetList: selectedList,
                                    newTask: {...task}
                                }));
                                dispatch(getActions().SelectTask(task.id));
                            }}
                            onTaskChanged={(task) => dispatch(getActions().UpdateTask(task))}
                            onListDelete={(listId) => {
                                dispatch(getActions().DeleteList(listId));
                            }}
                            onTaskDelete={(taskId) => {
                                dispatch(getActions().DeleteTask({fromList: selectedList, taskId}));
                            }}
                            onListChanged={(list) => {
                                dispatch(getActions().UpdateList(list))
                            }}
            />}
    </Fragment>
}

TasksView.propTypes = {
    taskLists: PropTypes.object.isRequired,
    selectedList: PropTypes.string
}

export default connect((state, ownProps) => {
    return state.tasks;
})(TasksView);