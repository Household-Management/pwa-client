import '@aws-amplify/ui-react/styles.css';
import {useContext, useEffect, useState} from "react";
import SignUp from "./SignUp";
import {Box, CircularProgress, Modal, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import SignIn from "./SignIn";
import {useDispatch, useSelector} from "react-redux";
import {ServiceWorkerContext} from "../../service-worker/ServiceWorkerContext";

export default function AppAuthenticator({children}) {
    const wb = useContext(ServiceWorkerContext);
    const dispatch = useDispatch();
    const [authenticationNeeded, setAuthenticationNeeded] = useState(false);
    const user = useSelector(state => state.user.user);

    useEffect(() => {
        if (user) {
            setAuthenticationNeeded(false)
        }
        if (!user && !authenticationNeeded) {
            wb.active.then(async () => {
                const response = await wb.messageSW({
                    type: 'AUTHENTICATE',
                    payload: {
                        useExisting: true
                    }
                });
                if (response.error) {
                    setAuthenticationNeeded(true);
                    throw new Error("Error in service worker: " + response.error.message);
                }
                setAuthenticationNeeded(false);
                dispatch({
                    type: "AUTHENTICATED",
                    data: response.payload,
                    noSave: true
                });
            });
        }
    }, [user, authenticationNeeded]);
    return <>
        {user ? children : (authenticationNeeded ? <Authentication/> : (
            <Box sx={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <CircularProgress/>
            </Box>))
        }
    </>
}

const modalStyle = {
    flexShrink: 1,
    display: "flex",
    justifySelf: "center",
    alignSelf: "center",
    width: 400,
    bgcolor: "background.paper",
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

function Authentication() {
    const [tab, setTab] = useState(0);
    return <Modal open={true}>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw"}}>
            <Box sx={modalStyle}>
                <Stack sx={{flexGrow: 1, justifyContent: "center", alignContent: "center"}} spacing={3}>
                    <ToggleButtonGroup sx={{justifyContent: "center", alignContent: "center"}} exclusive={true} value={tab} onChange={(e, v) => setTab(v)}>
                    <Stack direction="row"  spacing={1}>
                            <ToggleButton value={0}>Sign In</ToggleButton>
                            <ToggleButton value={1}>Sign Up</ToggleButton>
                    </Stack>
                    </ToggleButtonGroup>
                    <div>
                        {tab === 0 && <SignIn/>}
                        {tab === 1 && <SignUp/>}
                    </div>
                </Stack>
            </Box>
        </div>
    </Modal>
}