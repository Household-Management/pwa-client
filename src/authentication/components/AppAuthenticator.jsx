import {useContext, useEffect, useState} from "react";
import SignUp from "./SignUp";
import {Box, CircularProgress, Modal, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import SignIn from "./SignIn";
import {useDispatch, useSelector} from "react-redux";
import {ServiceWorkerContext} from "../../service-worker/ServiceWorkerContext";
import {useLocation} from "react-router";
import {useNavigate} from "react-router-dom";
import {getCurrentUser} from "aws-amplify/auth";
import {signIn, signOut} from "@aws-amplify/auth";

// TODO: When login fails while offline, tell the user that they need to be online to login.
export default function AppAuthenticator({children}) {
    const wb = useContext(ServiceWorkerContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [authenticationNeeded, setAuthenticationNeeded] = useState(false);
    const user = useSelector(state => state.user.user);
    const location = useLocation();

    useEffect(() => {
        (async () => {
            if (!user && !authenticationNeeded) {
                try {
                    const currentUser = await getCurrentUser();

                    if (currentUser) {
                        dispatch({
                            type: "AUTHENTICATED",
                            payload: response.payload,
                            noSave: true
                        });
                        navigate("/household-select")
                    }
                } catch (e) {
                    setAuthenticationNeeded(true)
                }
            }
        })()
    }, [user]);
    useEffect(() => {
        if (!user && location.pathname !== "/sign-in" && location.pathname !== "/sign-up") {
            navigate("/sign-in");
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
    const location = useLocation();
    const navigate = useNavigate();
    const tab = location.pathname === "/sign-in" ? "/sign-in" : "/sign-up";
    const submitAuth = async function (username, password) {
        await signOut();
        await signIn({
            username: email,
            password: password
        });
        const user = await getCurrentUser();
        const response = {
            payload: user
        };
        dispatch({
            type: "AUTHENTICATED",
            noSave: true,
            payload: response.payload
        });
        navigate("/household-select")
    }

    return <Modal open={true}>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw"}}>
            <Box sx={modalStyle}>
                <Stack sx={{flexGrow: 1, justifyContent: "center", alignContent: "center"}} spacing={3}>
                    <ToggleButtonGroup sx={{justifyContent: "center", alignContent: "center"}} exclusive={true}
                                       value={tab} onChange={(e, v) => navigate(v)}>
                        <Stack direction="row" spacing={1}>
                            <ToggleButton value="/sign-in">Sign In</ToggleButton>
                            <ToggleButton value="/sign-up">Sign Up</ToggleButton>
                        </Stack>
                    </ToggleButtonGroup>
                    <div>
                        {tab === "/sign-in" && <SignIn onSubmit={submitAuth}/>}
                        {tab === "/sign-up" && <SignUp/>}
                    </div>
                </Stack>
            </Box>
        </div>
    </Modal>
}