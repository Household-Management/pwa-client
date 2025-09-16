import {Stack, TextField, Button, Typography, LinearProgress} from "@mui/material";
import {useContext, useState} from "react";
import {AuthContext} from "./AppAuthenticator";

export default function () {
    const {email, setEmail, completeSignIn, startPasswordReset} = useContext(AuthContext);
    const [password, setPassword] = useState("");
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);

    async function submit() {
        try {
            setLoading(true);
            await completeSignIn(email, password);
            setLoading(false);
        } catch (e: any) {
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
                    variant="contained"
                    onClick={submit}
                    disabled={email?.length === 0 || password?.length === 0}>Sign In</Button>
            <Button id="password-reset"
                    variant="contained"
                    onClick={startPasswordReset}
                    disabled={!email || email?.length === 0}>
                Forgot Password?
            </Button>
        </Stack>
    </>
}