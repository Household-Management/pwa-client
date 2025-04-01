import {Stack, TextField, Button, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {signIn, signOut} from "@aws-amplify/auth";
import {Workbox} from "workbox-window";
import {ServiceWorkerContext} from "../../service-worker/ServiceWorkerContext";
import {useDispatch} from "react-redux";
import {getCurrentUser} from "aws-amplify/auth";
import {useNavigate} from "react-router-dom";


export default function () {
    const wb = useContext(ServiceWorkerContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser().then(user => {
            dispatch({
                type: "AUTHENTICATED",
                payload: user

            });
            navigate("/household-select")
        }, () => {

        });
    }, []);

    async function submit() {
        try {
            await wb.active;
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
        } catch (e) {
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