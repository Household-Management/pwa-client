import {IconButton, Paper} from "@mui/material";
import {Done} from "@mui/icons-material";

export default function IconTile({icon, onClick, color, size}) {
    return <Paper style={{marginLeft: "32px", borderRadius: "50%"}}>
        <IconButton onClick={onClick} color={color} size={size}>
            {icon}
        </IconButton>
    </Paper>
}