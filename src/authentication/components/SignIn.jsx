import {Stack, TextField, Button, Typography, LinearProgress} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {signIn, signOut} from "@aws-amplify/auth";
import {Workbox} from "workbox-window";
import {ServiceWorkerContext} from "../../service-worker/ServiceWorkerContext";
import {useDispatch} from "react-redux";
import {getCurrentUser} from "aws-amplify/auth";
import {useNavigate} from "react-router-dom";


export default function ({onSubmit}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function submit() {
        try {
            setLoading(true);
            await onSubmit(email, password);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            switch (e.name) {
                case "NotAuthorizedException":
                    setError(e.message);
                    break;
                default:
                    setError("There was an error signing in. Try again later.");
                    break;
            }
        }
    }

    return <>
        <Stack spacing={2}>
            {error ? <Typography sx={{color: "red", textAlign: "center"}}>{error}</Typography> : null}
            {loading ? <LinearProgress/> : null}
            <TextField id="login-email" label="Email" type="text" value={email}
                       onChange={e => setEmail(e.target.value)}></TextField>
            <TextField id="login-password" label="Password" type="password" value={password}
                       onChange={e => setPassword(e.target.value)}></TextField>
            <Button id="login-submit"
                    label="Sign In"
                    variant="contained"
                    onClick={submit}
                    disabled={email?.length === 0 || password?.length === 0}>Sign In</Button>
        </Stack>
    </>
}