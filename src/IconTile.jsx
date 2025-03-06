import {IconButton, Paper} from "@mui/material";
import Fab from "@mui/material/Fab";

export default function IconTile({icon, onClick, color, size}) {
    return <Paper style={{marginLeft: "32px", borderRadius: "50%", aspectRatio: 1}}>
        <Fab onClick={onClick} color={color} size={size}>
            {icon}
        </Fab>
    </Paper>
}