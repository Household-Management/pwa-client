import {useState, useEffect, useContext} from "react";
import {Stack, TextField, Button, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import {SignInPath} from "./AppAuthenticator";
import {AuthPasswordResetContext} from "./AuthenticationContext";

export default function PasswordReset() {
    const {email, completePasswordReset, authStep} = useContext(AuthPasswordResetContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate(SignInPath);
        }
    }, []);

    const handleSubmit = async (email, confirmCode, newPassword) => {
        return completePasswordReset(email, newPassword, confirmCode);
    };

    return <PasswordResetView email={email} authStep={authStep} onSubmit={handleSubmit}/>
}

export function PasswordResetView({email = "", authStep, onSubmit}) {
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState(null);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        if (newPassword && passwordConfirmation) {
            if (newPassword !== passwordConfirmation) {
                setValid(false);
                setError("Passwords do not match.");
            } else {
                setError("");
                setValid(true);
            }
        } else {
            setValid(false);
        }
    }, [newPassword, passwordConfirmation]);

    const handleSubmit = async () => {
        try {
            if (!resetCode || !newPassword || !passwordConfirmation) {
                setError("All fields are required.");
                return;
            }

            if (newPassword !== passwordConfirmation) {
                setError("Passwords do not match.");
                return;
            }
            await onSubmit(email, resetCode, newPassword);
        } catch (e) {
            setError("Failed to reset password. Please try again.");
        }
    }

    return (
        <form onSubmit={e => {
            e.preventDefault();
            submit();
        }}>
            <Stack spacing={2}>
                {!error && authStep === "REQUESTING_CODE" &&
                    <Typography sx={{textAlign: "center"}}>Requesting password reset code...</Typography>}
                {!error && authStep === "CONFIRM_RESET_PASSWORD_WITH_CODE" &&
                    <Typography sx={{textAlign: "center"}}>A confirmation code had been sent to {email}, enter it to
                        change
                        your password.</Typography>}
                {error && <Typography sx={{color: "red", textAlign: "center"}}>{error}</Typography>}
                <TextField
                    id="reset-code"
                    label="Reset Code"
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                />
                <TextField
                    id="new-password"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    id="confirm-password"
                    label="Confirm New Password"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!valid}
                >
                    Reset Password
                </Button>
            </Stack>
        </form>
    );
}