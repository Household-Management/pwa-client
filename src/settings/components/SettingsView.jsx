import {Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Paper} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import { useSelector} from "react-redux";
import {useHeader} from "../../layout/hooks/HeaderContext";
import {useCookies} from "react-cookie";
import LogOutButton from "../../authentication/components/LogOutButton";
import InviteMember from "./InviteMember";

export default function SettingsView() {
    const household = useSelector(state => state.household);
    const user = useSelector(state => state.user);
    const {setHeaderContent} = useHeader();
    const [cookies] = useCookies();
    const [open, setOpen] = useState(false);

    const roles = user.roles.filter(_ => _.endsWith(household.id)).map(_ => _.substring(0, _.indexOf(":")));

    useEffect(() => {
        setHeaderContent(null);
    }, []);

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <Stack spacing={10}>
            <LogOutButton/>

            {household && (
                <Paper sx={{padding: "5px"}}>
                <Stack spacing={2}>
                    <Typography variant="h6">Household: {household.name}</Typography>
                    <Typography variant="body1">Your Role: {roles[0]}</Typography>
                </Stack>
                </Paper>
            )}
            <Button variant="outlined" color="primary" onClick={handleOpen}>
                Invite Someone to your Household
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Invite Member</DialogTitle>
                <DialogContent>
                    <InviteMember householdId={cookies.household} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}