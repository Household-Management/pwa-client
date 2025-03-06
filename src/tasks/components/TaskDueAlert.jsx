import {Box, Button, Grid, Paper} from "@mui/material";
import PropTypes from "prop-types";
import {AccountBox} from "@mui/icons-material";
import AlarmIcon from '@mui/icons-material/Alarm';
import moment from "moment";

export default function TaskDueAlert({task, onComplete, onSnooze, onCancel}) {
    return <Paper style={{flexDirection: "column", display: "flex"}}>
        <Grid container align="center">
            <Grid item xs={12} align="center">
                {task.title} {task.description && "- " + task.description}
            </Grid>
            <Grid item xs={12} justifyContent="center" alignItems="center">
                <AlarmIcon fontSize="large" color="warning"/> Due At {moment(task.scheduledTime).format("hh:mm A")}
            </Grid>
            <Grid container justifyContent="space-around">
                <Grid item>
                    <Button variant="contained" color="success" onClick={onComplete}>Complete</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="warning" onClick={onSnooze}>Snooze</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="error" onClick={onCancel}>Cancel</Button>
                </Grid>
            </Grid>
        </Grid>
    </Paper>
}

TaskDueAlert.propTypes = {
    task: PropTypes.object.isRequired,
    onComplete: PropTypes.func,
    onSnooze: PropTypes.func,
    onCancel: PropTypes.func
}