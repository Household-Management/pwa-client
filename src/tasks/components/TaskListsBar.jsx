import {
    IconButton, Toolbar
} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {forwardRef} from "react";
import AddIcon from '@mui/icons-material/Add';
import PropTypes from "prop-types";
import { useNavigate} from "react-router-dom";

/**
 * Component for displaying the summarized list of all users to-do lists.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function TaskListsBar(props) {
    // FIXME: Have todo list use a normal id, instead of trying to use the "todo" special name
    const navigate = useNavigate();
    return <div style={{overflowX: "auto"}}>
        <Toolbar sx={{width: "100%", justifyContent: "flex-start", boxSizing: "border-box"}}>
            <IconButton variant="contained" color="primary" data-testid="new-list" onClick={props.onListCreated}>
                <AddIcon/>
            </IconButton>
            <Tabs value={props.selectedList}
                  variant="scrollable"
                  onClick={() => {

                  }}
                  onChange={(e, value) => {
                      navigate(`/tasks/${value}`);
                  }}>
                {
                    props.taskLists.map(list =>
                        (<Tab value={list.id}
                              key={list.id}
                              label={list.name || "New List"}
                        />)
                    )
                }
            </Tabs>
        </Toolbar>
    </div>

}

TaskListsBar.propTypes = {
    taskLists: PropTypes.array.isRequired,
    selectedList: PropTypes.string.isRequired,
    onListCreated: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
}

export default TaskListsBar;