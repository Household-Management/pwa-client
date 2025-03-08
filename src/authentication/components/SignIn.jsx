import {Stack, TextField, Button} from "@mui/material";
import {useContext, useState} from "react";
import {signIn} from "@aws-amplify/auth";
import {Workbox} from "workbox-window";
import {ServiceWorkerContext} from "../../service-worker/ServiceWorkerContext";
import {useDispatch} from "react-redux";


export default function () {
    const wb = useContext(ServiceWorkerContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    async function submit() {
        await wb.active;
        const response = await wb.messageSW({
            type: "AUTHENTICATE",
            payload: {
                username: email,
                password: password
            }
        });
        dispatch({
            type: "AUTHENTICATED",
            data: response.payload
        })
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