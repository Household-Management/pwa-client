import {
    Divider,
    IconButton, Paper, Toolbar
} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from "prop-types";

export default function TaskListsBar({ taskLists, selectedList, onListCreated, onSelect}) {
    return <Paper sx={{overflowX: "auto"}}>
        <Toolbar sx={{width: "100%", justifyContent: "flex-start", boxSizing: "border-box"}}>
            <IconButton variant="outlined" color="primary" data-testid="new-list" onClick={onListCreated}>
                <AddIcon/>
            </IconButton>
            <Tabs value={selectedList}
                  variant="scrollable"
                  onClick={() => {

                  }}
                  onChange={(e, value) => {
                      onSelect(value);
                  }}>
                {
                    taskLists.toSorted((a, b) => {
                        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
                    }).map(list =>
                        (<Tab value={list.id}
                              key={list.id}
                              label={list.name || "New List"}
                        />)
                    )
                }
            </Tabs>
        </Toolbar>
    </Paper>

}

TaskListsBar.propTypes = {
    taskLists: PropTypes.array.isRequired,
    selectedList: PropTypes.string,
    onListCreated: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
}