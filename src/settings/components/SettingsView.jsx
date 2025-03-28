import {Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useHeader} from "../../layout/hooks/HeaderContext";
import {useCookies} from "react-cookie";
import {DataClientContext} from "../../graphql/DataClient";
import LogOutButton from "../../authentication/components/LogOutButton";
import InviteMember from "./InviteMember";

export default function SettingsView() {
    const dataClient = useContext(DataClientContext);
    const dispatch = useDispatch();
    const {setHeaderContent} = useHeader();
    const [cookies, setCookie] = useCookies();
    const [open, setOpen] = useState(false);

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