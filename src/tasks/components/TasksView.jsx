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
import _ from "lodash";

/**
 * Top-level container for all user tasks ui elements.
 * @constructor
 */
// TODO: Check for if a task is being edited when trying to open another one?
// TODO: Handle deleting lists and tasks.
export default function TasksView() {
    const {setHeaderContent} = useHeader()
    const dispatch = useDispatch();
    const taskLists = useSelector(selectLists);
    const {id: selectedListId} = useParams();
    const realSelectedListId = selectedListId === "todo" ? taskLists[0].id : selectedListId;
    const selectedTask = useSelector(selectActiveTask);
    const navigate = useNavigate();

    useEffect(() => {

        setHeaderContent(<TaskListsBar taskLists={taskLists}
                                       onSelect={selected => navigate(`/tasks/${selected}`)}
                                       selectedList={realSelectedListId}
                                       onListCreated={() => {
                                           // TODO: Persist to backend also
                                           const newList = {id: crypto.randomUUID(), name: "", taskItems: []};
                                           dispatch(CreateList(newList));
                                           navigate(`/tasks/${newList.id}`);
                                       }}
        />)
    }, [taskLists, selectedListId]);

    return <Fragment>
        {selectedListId && taskLists.find(_ => _.id === realSelectedListId) &&
            <TaskListDetail list={taskLists.find(_ => _.id === realSelectedListId)}
                            selectedTask={selectedTask}
                            onTaskSelected={(taskId) => {
                                if (taskId) {
                                    navigate(`/tasks/${realSelectedListId}/task/${taskId}`)
                                } else {
                                    navigate(`/tasks/${realSelectedListId}`);
                                }
                            }}
                            onTaskCreated={() => {
                                const task = new Task(crypto.randomUUID(), "New Task", "");
                                dispatch(CreateTask({
                                    targetList: realSelectedListId,
                                    newTask: {...task}
                                }));
                                navigate(`/tasks/${realSelectedListId}/task/${task.id}?edit=true`);
                            }}
                            onTaskChanged={(task) => dispatch(UpdateTask({selectedListId, task}))}
                            onListDelete={(listId) => {
                                dispatch(DeleteList(listId));
                                let lists = Object.keys(taskLists)
                                let index = Math.max(0, lists.indexOf(listId) - 1);

                                navigate(`/tasks/${lists[index]}`);
                            }}
                            onTaskDelete={(taskId) => {
                                dispatch(DeleteTask({fromList: realSelectedListId, taskId}));
                            }}
                            onListChanged={(list) => {
                                dispatch(UpdateList(list))
                            }}
            />}
    </Fragment>
}