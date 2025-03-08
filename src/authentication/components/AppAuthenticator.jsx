import {getCurrentUser} from "@aws-amplify/auth";
import '@aws-amplify/ui-react/styles.css';
import {useEffect, useState} from "react";
import {Hub} from "@aws-amplify/core";
import SignUp from "./SignUp";
import {Box, Modal, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import SignIn from "./SignIn";
import {useSelector} from "react-redux";

export default function AppAuthenticator({children}) {
    const user = useSelector(state => state.user);
    useEffect(() => {
        Hub.listen("auth", ({payload: {event, data}}) => {
            switch (event) {
                case "signIn":
                    console.log("User signed in");
                    break;
                case "signOut":
                    console.log("User signed out");
                    break;
            }
        });
    }, []);
    return <>
        {user ? children : <Authentication/> }
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
                <Stack sx={{flexGrow: 1, justifyContent: "center", alignContent: "center"}}>
                    <Stack direction="row" sx={{justifyContent: "center", alignContent: "center"}}>
                        <ToggleButtonGroup exclusive={true} value={tab} onChange={(e, v) => setTab(v)}>
                            <ToggleButton value={0}>Sign In</ToggleButton>
                            <ToggleButton value={1}>Sign Up</ToggleButton>
                        </ToggleButtonGroup>
                    </Stack>
                    <div>
                        {tab === 0 && <SignIn/>}
                        {tab === 1 && <SignUp/>}
                    </div>
                </Stack>
            </Box>
        </div>
    </Modal>
}