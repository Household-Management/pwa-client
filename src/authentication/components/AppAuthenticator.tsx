import {useEffect, useState, useContext} from "react";
import {Box, CircularProgress, Modal, Stack, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import PasswordReset from "./PasswordReset";
import AuthContext from "./AuthenticationContext";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {getCurrentUser, fetchAuthSession, SignInOutput} from "aws-amplify/auth";
import _ from "lodash";
import {AuthSignUpContext, AuthSignInContext, AuthPasswordResetContext} from "./AuthenticationContext";
import {
    confirmSignUp as amplifyConfirmSignUp,
    signIn as amplifySignIn,
    signOut,
    SignUpOutput,
    signUp as amplifySignUp,
    resetPassword as amplifyResetPassword,
    confirmResetPassword as amplifyConfirmResetPassword
} from "@aws-amplify/auth";

export type AuthStep = null
    | SignInAuthStep
    | SignUpAuthStep
    | ResetPasswordAuthStep;

export type SignInAuthStep = "BEGIN_SIGN_IN"
    | "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
    | "CONTINUE_SIGN_IN_WITH_MFA_SELECTION"
    | "CONFIRM_SIGN_IN_WITH_SMS_CODE"
    | "CONFIRM_SIGN_IN_WITH_TOTP_CODE"
    | "CONFIRM_SIGN_IN_WITH_EMAIL_CODE"
    | "CONTINUE_SIGN_IN_WITH_TOTP_SETUP"
    | "CONTINUE_SIGN_IN_WITH_EMAIL_SETUP"
    | "CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION"
    | "CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION"
    | "CONFIRM_SIGN_IN_WITH_PASSWORD"
    | "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
    | "DONE"

export type SignUpAuthStep = "BEGIN_SIGN_UP" | "CONFIRM_SIGN_UP" | "COMPLETE_AUTO_SIGN_IN" | "DONE";

export type ResetPasswordAuthStep = "BEGIN_PASSWORD_RESET" | "CONFIRM_RESET_PASSWORD_WITH_CODE" | "DONE";

export const SignInPath: AuthenticationPath = "/sign-in";
export const SignUpPath: AuthenticationPath = "/sign-up";
export const ResetPasswordPath: AuthenticationPath = "/reset-password";

export type AuthenticationPath = "/sign-in" | "/sign-up" | "/reset-password";

export default function AppAuthenticator({children}: { children?: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user);

    const [tab, setTab] = useState<AuthenticationPath>(SignInPath);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [authenticationNeeded, setAuthenticationNeeded] = useState(false);
    const [authStep, setAuthStep] = useState<AuthStep>("BEGIN_SIGN_IN");

    /**
     * Starts the sign-up process with the given email, password and password confirmation.
     *
     * Sign-up is finished by calling `completeSignUp` with the username (email) and confirmation code.
     * @param email
     * @param password
     * @param confirmPassword
     */
    const startSignup = async function (email: string, password: string, confirmPassword: string): Promise<SignUpOutput> {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        const signUpResult = await amplifySignUp({
            username: email,
            password,
            options: {
                userAttributes: {
                    email
                }
            }
        });
        setAuthStep(signUpResult.nextStep.signUpStep);
        return signUpResult;
    }
    /**
     * Complete the sign-up process with a confirmation code.
     *
     * On successful confirmation, the user is signed in.
     * @param username
     * @param confirmationCode
     */
    const completeSignUp = async (username, confirmationCode) => {
        await signOut();
        const signUpConfirmation = await amplifyConfirmSignUp({
            username,
            confirmationCode
        });

        setAuthStep(signUpConfirmation.nextStep.signUpStep);

        if (signUpConfirmation.isSignUpComplete) {
            await completeSignIn(email, password)
            return;
        }

        return signUpConfirmation;
    }

    /**
     * Sign in with the given username and password.
     * @param username
     * @param password
     */
    const completeSignIn = async (username, password): Promise<SignInOutput | undefined> => {
        await signOut();
        const signInResult = await amplifySignIn({username, password});
        if (signInResult.isSignedIn) {
            const currentUser = await getCurrentUser();
            const currentAuth = await fetchAuthSession();
            dispatch({
                type: "AUTHENTICATED",
                noSave: true,
                payload: mapAuthenticationPayload(currentUser, currentAuth),
            });
            navigate("/household-select");
        } else {
            return signInResult;
        }
    };

    const startPasswordReset = async function () {
        const reset = await amplifyResetPassword({
            username: email
        });

        setAuthStep(reset.nextStep.resetPasswordStep);

        return reset;
    }

    const completePasswordReset = async (username: string, newPassword: string, confirmationCode: string) => {
        try {

            await amplifyConfirmResetPassword({
                username,
                newPassword,
                confirmationCode
            });
            setAuthStep("BEGIN_SIGN_IN")
            setMessage("Your password has been reset. Please sign in with your new password.");
            navigate(SignInPath);
        } catch (e: any) {
            setAuthStep(null);
            throw e;
        }
    }

    const authState = {
        tab, // Which tab is shown
        message,
        setMessage,
        email, // The email address from the user
        setEmail, // Change the email address
        password,
        setPassword,
        startSignup, // Function to start the sign-up process
        startPasswordReset, // Function to start the password reset process
        completeSignIn, // Function to sign in
        completeSignUp, // Function to sign up
        completePasswordReset, // Function to reset password
        authenticationNeeded, // Whether authentication is needed after attempting automatic sign-in
        authStep, // Current authentication step
        setAuthStep // Function to change the authentication step
    };

    useEffect(() => {
        (async () => {
            let authenticated = false;
            if (!user?.authenticated && !authenticationNeeded) {
                try {
                    const currentUser = await getCurrentUser();
                    const currentAuth = await fetchAuthSession();

                    if (currentUser) {
                        dispatch({
                            type: "AUTHENTICATED",
                            payload: mapAuthenticationPayload(currentUser, currentAuth),
                            noSave: true,
                        });
                        navigate("/household-select");
                        authenticated = true;
                    }
                } catch (_e: any) {
                    console.log(_e.message);
                }
            }
            setAuthenticationNeeded(!authenticated);
        })();
    }, [user?.authenticated, authenticationNeeded]);

    useEffect(() => {
        switch (authStep) {
            case "BEGIN_SIGN_IN":
                if (location.pathname !== SignInPath) {
                    navigate(SignInPath);
                }
                setTab(SignInPath);
                break;
            case "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE":
            case "CONTINUE_SIGN_IN_WITH_MFA_SELECTION":
            case "CONFIRM_SIGN_IN_WITH_SMS_CODE":
            case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
            case "CONFIRM_SIGN_IN_WITH_EMAIL_CODE":
            case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
            case "CONTINUE_SIGN_IN_WITH_EMAIL_SETUP":
            case "CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION":
            case "CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION":
            case "CONFIRM_SIGN_IN_WITH_PASSWORD":
            case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
                if (location.pathname !== SignUpPath) {
                    navigate(SignUpPath);
                }
                setTab(SignUpPath);
                break;
            case "BEGIN_PASSWORD_RESET":
            case "CONFIRM_RESET_PASSWORD_WITH_CODE":
            case "DONE":
                if (location.pathname !== ResetPasswordPath) {
                    navigate(ResetPasswordPath);
                }
                setTab(ResetPasswordPath);
                break;
            default:
                navigate(SignInPath);
                break;
        }
    }, [authStep, location.pathname]);


    return (
        <>
            {user?.authenticated ? (
                children
            ) : authenticationNeeded ? (
                <AuthContext.Provider value={authState}>
                    <AuthSignInContext.Provider value={authState}>
                        <AuthSignUpContext.Provider value={authState}>
                            <AuthPasswordResetContext.Provider value={authState}>
                                <AuthenticationView
                                    navigate={navigate}
                                />
                            </AuthPasswordResetContext.Provider>
                        </AuthSignUpContext.Provider>
                    </AuthSignInContext.Provider>
                </AuthContext.Provider>
            ) : (
                <Box sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <CircularProgress/>
                </Box>
            )}
        </>
    );
}

export function AuthenticationView({navigate}) {
    const {tab, message} = useContext(AuthContext);
    const modalStyle = {
        flexShrink: 1,
        display: "flex",
        justifySelf: "center",
        alignSelf: "center",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal open={true}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw"
            }}>
                <Box sx={modalStyle}>
                    <Stack sx={{flexGrow: 1, justifyContent: "center", alignContent: "center"}} spacing={3}>
                        <ToggleButtonGroup
                            sx={{justifyContent: "center", alignContent: "center"}}
                            exclusive={true}
                            value={tab}
                            onChange={(_e: any, v: string) => navigate(v)}
                        >
                            <Stack direction="row" spacing={1}>
                                <ToggleButton value={SignInPath}>Sign In</ToggleButton>
                                <ToggleButton value={SignUpPath}>Sign Up</ToggleButton>
                            </Stack>
                        </ToggleButtonGroup>
                        {message && <Typography sx={{color: "green"}}>{message}</Typography>}
                        <div>
                            {tab === SignInPath && <SignIn/>}
                            {tab === SignUpPath && <SignUp/>}
                            {tab === ResetPasswordPath && <PasswordReset/>}
                        </div>
                    </Stack>
                </Box>
            </div>
        </Modal>
    );
}

function mapAuthenticationPayload(currentUser, currentAuth) {
    return _.mapKeys(
        _.merge(
            {authenticated: true},
            _.pick(currentAuth.tokens.accessToken.payload, ["cognito:groups"]),
            _.pick(currentUser.signInDetails, ["loginId"])
        ),
        (_value: any, key: string) => (key === "cognito:groups" ? "roles" : key)
    );
}