import {Stack, TextField, Button} from "@mui/material";
import {useState} from "react";
import {signIn} from "@aws-amplify/auth";

export default function () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function submit() {
        navigator.serviceWorker.controller.postMessage({
            type: "AUTHENTICATE",
            payload: {
                username: email,
                password: password
            }
        });
    }
    return <>
        <Stack spacing={2}>
            <TextField label="Email" type="text" value={email} onChange={e => setEmail(e.target.value)}></TextField>
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}></TextField>
            <Button label="Sign In"
                    variant="contained"
                    onClick={submit}
                    disabled={email?.length === 0 || password?.length === 0}>Sign In</Button>
        </Stack>
        </>
}