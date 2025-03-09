import {
    IconButton, Toolbar
} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {forwardRef} from "react";
import AddIcon from '@mui/icons-material/Add';
import PropTypes from "prop-types";
import {Link, NavLink} from "react-router-dom";
import {useParams} from "react-router-dom";

/**
 * Component for displaying the summarized list of all users to-do lists.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
// FIXME: Alerts show beneath this header.
function TaskListsBar(props) {
    return <div style={{overflowX: "auto"}}>
        <Toolbar sx={{width: "100%", justifyContent: "flex-start", boxSizing: "border-box"}}>
            <IconButton variant="contained" color="primary" data-testid="new-list" onClick={props.onListCreated}>
                <AddIcon/>
            </IconButton>
            <Tabs value={props.selectedList}
                  variant="scrollable"
                  onChange={(e, value) => props.onSelect(value || props.selectedList)}>
                {
                    Object.values(props.taskLists).map(list =>
                        (<Tab value={list.id}
                              key={list.id}
                              label={list.name || "New List"}
                              // component={forwardRef((props, ref) => <NavLink {...props} ref={ref} />)}
                        >
                            {/*<NavLink to={`/tasks/${list.id}`} className="nav-link"/>*/}
                        </Tab>)
                    )
                }
            </Tabs>
        </Toolbar>
    </div>

}

TaskListsBar.propTypes = {
    taskLists: PropTypes.object.isRequired,
    selectedList: PropTypes.string.isRequired,
    onListCreated: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
}

export default TaskListsBar;