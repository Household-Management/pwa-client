import '@aws-amplify/ui-react/styles.css';
import {useContext, useEffect, useState} from "react";
import SignUp from "./SignUp";
import {Box, CircularProgress, Modal, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import SignIn from "./SignIn";
import {useDispatch, useSelector} from "react-redux";
import {ServiceWorkerContext} from "../../service-worker/ServiceWorkerContext";
import {useLocation} from "react-router";
import {useNavigate} from "react-router-dom";
import {getCurrentUser} from "aws-amplify/auth";

// TODO: Add role guard elements
// TODO: When login fails while offline, tell the user that they need to be online to login.
export default function AppAuthenticator({children}) {
    const wb = useContext(ServiceWorkerContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [authenticationNeeded, setAuthenticationNeeded] = useState(false);
    const user = useSelector(state => state.user.user);
    const location = useLocation();

    useEffect(() => {
        if (!user && !authenticationNeeded) {
            wb.active.then(async () => {
                try {
                    const currentUser = await getCurrentUser();

                    if (currentUser) {
                        dispatch({
                            type: "AUTHENTICATED",
                            payload: response.payload,
                            noSave: true
                        });
                    }
                } catch (e) {
                    setAuthenticationNeeded(true)
                }
            });
        }
    }, [user]);
    useEffect(() => {
        if(!user && location.pathname !== "/sign-in") {
            navigate("/sign-in");
        } else if(user) {
            navigate("/")
        }
    }, [user, location]);
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
                    <ToggleButtonGroup sx={{justifyContent: "center", alignContent: "center"}} exclusive={true}
                                       value={tab} onChange={(e, v) => setTab(v)}>
                        <Stack direction="row" spacing={1}>
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