import { useState, useEffect } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { useNavigate } from "react-router";

export default function PasswordReset({ email = "" }) {
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState("");
    const [stage, setStage] = useState("REQUESTING_CODE");
    const navigate = useNavigate();

    useEffect(() => {
        if(!email) {
            navigate("/sign-in");
        }
    }, []);

    useEffect(() => {
        if (newPassword && passwordConfirmation && newPassword !== passwordConfirmation) {
            setValidationError("Passwords do not match.");
        } else {
            setValidationError("");
        }
    }, [newPassword, passwordConfirmation]);

    useEffect(() => {
        (async function() {
            try {
                const reset = await resetPassword({
                    username: email
                });


                const {nextStep} = reset;
                setStage(nextStep.resetPasswordStep);
                switch (nextStep.resetPasswordStep) {
                    case "CONFIRM_RESET_PASSWORD_WITH_CODE":
                        // Code sent to user's email
                        break;
                    default:
                        setError("Unexpected step in password reset process.");
                }
            } catch (err) {
                switch (err.name) {
                    case "LimitExceededException":
                        setError("Attempt limit exceeded, please try again later.");
                        break;
                    default:
                        setError("Failed to initiate password reset. Please try again.");
                        break;
                }
            }
        })();
    }, []);

    const onSubmit = async () => {
        const confirm = await confirmResetPassword({
            username: email,
            confirmationCode: resetCode,
            newPassword
        });
        const {nextStep} = confirm;
        if (nextStep.resetPasswordStep === "DONE") {
            navigate("/sign-in");
        } else {
            setError("Unexpected step in password reset confirmation.");
        }
    }

    const handleSubmit = async () => {
        try {
            if (!resetCode || !newPassword || !passwordConfirmation) {
                setError("All fields are required.");
                return;
            }
            if (validationError) {
                return;
            }
            await onSubmit(email, resetCode, newPassword);
        } catch (e) {
            setError("Failed to reset password. Please try again.");
        }
    };

    return <PasswordResetView email={email} stage={stage} error={error}/>
}

export function PasswordResetView({ email = "" , stage, error}) {

    return (
        <Stack spacing={2}>
            {!error && stage === "REQUESTING_CODE" && <Typography sx={{textAlign: "center"}}>Requesting password reset code...</Typography>}
            {!error && stage === "CONFIRM_RESET_PASSWORD_WITH_CODE" && <Typography sx={{textAlign: "center"}}>A confirmation code had been sent to {email}, enter it to change your password.</Typography> }
            {error && <Typography sx={{ color: "red", textAlign: "center" }}>{error}</Typography>}
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
            {validationError && (
                <Typography sx={{ color: "red", textAlign: "center" }}>{validationError}</Typography>
            )}
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!resetCode || !newPassword || validationError}
            >
                Reset Password
            </Button>
        </Stack>
    );
}