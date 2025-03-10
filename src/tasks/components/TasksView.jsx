import TaskListsBar from "./TaskListsBar";
import {Fragment, useEffect} from "react";

import {useDispatch, useSelector} from "react-redux";
import {
    CreateList,
    selectLists,
    selectActiveTask,
    CreateTask,
    DeleteList,
    UpdateTask, DeleteTask, UpdateList
} from "../state/TaskStateConfiguration";
import TaskListDetail from "./TaskListDetail";
import Task from "../model/Task";
import {useHeader} from "../../layout/hooks/HeaderContext";
import {useNavigate, useParams} from "react-router-dom";

/**
 * Top-level container for all user tasks ui elements.
 * @constructor
 */
// TODO: Check for if a task is being edited when trying to open another one?
// TODO: Handle deleting lists and tasks.
export function TasksView() {
    const { setHeaderContent } = useHeader()
    const dispatch = useDispatch();
    const taskLists = useSelector(selectLists);
    const { id } = useParams();
    const selectedTask = useSelector(selectActiveTask);
    const navigate = useNavigate();

    useEffect(() => {
        if(!taskLists[selectedTask]) {
            navigate(`/tasks/todo`);
        }
    }, [selectedTask])

    useEffect(() => {
        setHeaderContent(<TaskListsBar taskLists={taskLists}
                                       onSelect={selected => navigate(`/tasks/${selected}`)}
                                       selectedList={id}
                                       onListCreated={() => {
                                           const newList = {id: crypto.randomUUID(), name: "", taskItems: []};
                                           dispatch(CreateList(newList));
                                           navigate(`/tasks/${newList.id}`);
                                       }}
        />)
    }, [taskLists, id]);

    return <Fragment>
        {id && taskLists[id] &&
            <TaskListDetail list={taskLists[id]}
                            selectedTask={selectedTask}
                            onTaskSelected={(task) => navigate(`/tasks/${task.id}`)}
                            onTaskCreated={() => {
                                const task = new Task(crypto.randomUUID(), "New Task", "");
                                dispatch(CreateTask({
                                    targetList: id,
                                    newTask: {...task}
                                }));
                            }}
                            onTaskChanged={(task) => dispatch(UpdateTask(task))}
                            onListDelete={(listId) => {
                                dispatch(DeleteList(listId));
                            }}
                            onTaskDelete={(taskId) => {
                                dispatch(DeleteTask({fromList: id, taskId}));
                            }}
                            onListChanged={(list) => {
                                dispatch(UpdateList(list))
                            }}
            />}
    </Fragment>
}