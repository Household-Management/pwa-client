import {Stack, TextField, Button, Typography, LinearProgress} from "@mui/material";
import {useContext, useState} from "react";
import {AuthSignInContext} from "./AuthenticationContext.ts";
import PasswordField from "./PasswordField.tsx";

export default function ({}) {
    const {email, setEmail, password, setPassword, completeSignIn, startPasswordReset} = useContext(AuthSignInContext);
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);

    async function submit() {
        try {
            setLoading(true);
            await completeSignIn(email, password as string);
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

    return (
        <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <Stack spacing={2}>
                {error ? <Typography sx={{color: "red", textAlign: "center"}}>{error}</Typography> : null}
                {loading ? <LinearProgress/> : null}
                <TextField id="login-email" label="Email" type="text" value={email}
                           onChange={e => setEmail(e.target.value)} />
                <PasswordField id="login-password" label="Password" type="password" value={password}
                               onChange={e => setPassword(e.target.value)} />
                <Button id="login-submit"
                        type="submit"
                        variant="contained"
                        // onClick={submit}
                        disabled={email?.length === 0 || password?.length === 0}>Sign In</Button>
                <Button id="password-reset"
                        variant="contained"
                        onClick={startPasswordReset}
                        disabled={!email || email?.length === 0}>
                    Forgot Password?
                </Button>
            </Stack>
        </form>
    );
}