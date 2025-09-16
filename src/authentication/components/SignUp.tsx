import {useContext, useEffect, useState} from "react";
import {
    Box,
    Button, CircularProgress, IconButton,
    InputAdornment,
    Modal, Slide,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {AuthContext} from "./AppAuthenticator";

export default function () {
    return <EmailSignUp/>
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


function EmailSignUp() {
    const {email, setEmail, completeSignIn, startSignup, authStep, setAuthStep, completeSignUp} = useContext(AuthContext);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [confirmCode, setConfirmCode] = useState("");
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        if (password.length > 0 && password.length < 12) {
            setError("Minimum password length is 12 characters.");
        } else if (password !== confirmPassword) {
            setError("Passwords do not match.");
        } else {
            setError(null);
        }

        if (confirmCode.length === 6) {
            (async () => {
                setInProgress(true);
                const confirmation = await completeSignUp(email, confirmCode);
                if(confirmation.isSignUpComplete) {
                    await completeSignIn(email, password);
                } else {

                }
            })();

        }
    }, [email, password, confirmPassword, confirmCode]);

    async function submit() {
        try {
            const nextStep = await startSignup(email, password, confirmPassword);

            setAuthStep(nextStep);
        } catch (e: any) {
            setError(e.message);
        }
    }

    return <>
        <Stack spacing={3}>
            <Typography>
                Enter email and password to create a new account.
            </Typography>
            <Typography color="error" sx={{minHeight: 24}}>{error}</Typography>
            <TextField type="email"
                       label="Email"
                       value={email}
                       onChange={e => setEmail(e.target.value)}/>
            <TextField type={showPassword ? "text" : "password"}
                       error={password?.length > 0 && password?.length < 12}
                       label="Password"
                       value={password}
                       onChange={e => setPassword(e.target.value)}
                       slotProps={{
                           input: {
                               endAdornment: (<InputAdornment position="end">
                                   <IconButton
                                       onClick={() => setShowPassword(!showPassword)}>
                                       {showPassword ? <Visibility/> : <VisibilityOff/>}
                                   </IconButton>
                               </InputAdornment>)
                           }
                       }}
            />
            <TextField type={showConfirmPassword ? "text" : "password"}
                       error={password?.length > 0 && password !== confirmPassword}
                       label="Confirm Password"
                       value={confirmPassword}
                       onChange={e => setConfirmPassword(e.target.value)}
                       slotProps={{
                           input: {
                               endAdornment: (<InputAdornment position="end">
                                   <IconButton
                                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                       {showConfirmPassword ? <Visibility/> : <VisibilityOff/>}
                                   </IconButton>
                               </InputAdornment>)
                           }
                       }}
            />
            <Button variant="contained" disabled={!!error || email.length === 0 || password.length === 0}
                    onClick={submit}>Sign
                Up</Button>
        </Stack>

        <Modal open={authStep === "CONFIRM_SIGN_UP"}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw"
            }}>
                <Slide
                    direction="right"
                    in={authStep === "CONFIRM_SIGN_UP"} mountOnEnter unmountOnExit
                >
                    <Box sx={{...modalStyle}}>
                        <Stack spacing={2}>
                            <span>Enter the confirmation code sent to your email.</span>
                            <TextField
                                label="Confirm Code"
                                onChange={e => setConfirmCode(e.target.value)}
                            ></TextField>
                            {inProgress && <CircularProgress /> } {/* TODO: Center horizontally. */}
                            <Button variant="contained" color="error" onClick={() => setAuthStep(null)}>Cancel</Button>
                        </Stack>
                    </Box>
                </Slide>
            </div>
        </Modal>
    </>
}