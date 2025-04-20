import {ListSubheader, TextField} from "@mui/material";
import Fab from "@mui/material/Fab";
import {Delete, Done, Edit} from "@mui/icons-material";
import PropTypes from "prop-types";

export default function TaskListHeader({list, editing, toggleEditing, onListChanged, onListDelete}) {
    return <ListSubheader sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
        <TextField sx={{width: "75%"}}
                   value={list.name}
                   placeholder="New List"
                   onChange={ev => onListChanged({...list, name: ev.target.value})}
                   disabled={list.unremovable || !editing}
        />
        {!list.unremovable && <div style={{flexGrow: 1, display: "flex", justifyContent: "space-evenly"}}>
            <Fab color="primary" onClick={() => toggleEditing(!editing)}>
                {editing ? <Done/> : <Edit/>}
            </Fab>
            <Fab color="error" onClick={onListDelete.bind(null, list.id)}
                 sx={{visibility: editing ? "visible" : "hidden"}}>
                <Delete/>
            </Fab>
        </div>}
    </ListSubheader>
}

TaskListHeader.propTypes = {
    list: PropTypes.object.isRequired,
    editing: PropTypes.bool.isRequired,
    toggleEditing: PropTypes.func.isRequired,
    onListChanged: PropTypes.func.isRequired,
    onListDelete: PropTypes.func.isRequired,
}