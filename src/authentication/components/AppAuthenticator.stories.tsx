import {useState} from "react";
import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import {MemoryRouter, useLocation, useNavigate} from "react-router-dom";
import AuthContext, {
    AuthPasswordResetContext,
    AuthSignUpContext,
    AuthSignInContext,
    AuthSignUpContextType, AuthSignInContextType, AuthPasswordResetContextType
} from "./AuthenticationContext";
import {
    AuthenticationPath,
    AuthenticationView,
    AuthStep,
    ResetPasswordPath,
    SignInPath,
    SignUpPath
} from "./AppAuthenticator";
import {Box, Modal, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {fn} from "storybook/test";
import {ResetPasswordOutput} from "aws-amplify/auth";
import {SignUpOutput} from "@aws-amplify/auth";

const store = configureStore({
    reducer: (state) => state || {user: null},
});

export default {
    title: "Authentication/Authenticator",
    component: AuthenticationView,
    decorators: [
        (Story) => (
            <Provider store={store}>
                <MemoryRouter initialEntries={[SignInPath]}>
                    <Box sx={{height: "100vh", width: "100vw"}}>
                        <Story/>
                    </Box>
                </MemoryRouter>
            </Provider>
        ),
    ],
    excludeStories: ["ContainerTemplate"]
};

const AuthenticatorTemplate = (storyArgs) => {
    const location = useLocation();
    const doNavigate = useNavigate();
    const navigate = (path: string) => {
        storyArgs.navigate(path);
        doNavigate(path);
    }
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState("");
    const [authStep, setAuthStep] = useState<AuthStep>("BEGIN_SIGN_IN");
    const [authenticationNeeded] = useState(false);
    let tab: AuthenticationPath = location.pathname as any;

    function withLatency<T extends (this: any, ...args: any[]) => any>(
        fn: T
    ): (
        this: ThisParameterType<T>,
        ...args: Parameters<T>
    ) => Promise<Awaited<ReturnType<T>>> {
        return async function (this: ThisParameterType<T>, ...args: Parameters<T>) {
            await new Promise((resolve) => setTimeout(resolve, storyArgs.latency));
            return await fn.apply(this, args as any);
        };
    }

    const auth: AuthSignUpContextType & AuthSignInContextType & AuthPasswordResetContextType = {
        tab, // Which tab is shown
        email, // The email address from the user
        setEmail, // Change the email address
        message, // Message to show to the user
        setMessage, // Change the message
        password,
        setPassword,
        startSignup: withLatency(async (): Promise<SignUpOutput> => {
            storyArgs.startSignUp
            return {
                isSignUpComplete: false,
                nextStep: {
                    codeDeliveryDetails: {
                        attributeName: "email",
                        deliveryMedium: "EMAIL",
                        destination: email
                    },
                    signUpStep: "CONFIRM_SIGN_UP",
                },
                userId: ""
            }
        }), // Function to start the sign-up process
        startPasswordReset: async (): Promise<ResetPasswordOutput> => {
            storyArgs.startPasswordReset();
            navigate(ResetPasswordPath)
            return {
                isPasswordReset: false,
                nextStep: {
                    resetPasswordStep: "CONFIRM_RESET_PASSWORD_WITH_CODE",
                    codeDeliveryDetails: {
                        attributeName: "email",
                        deliveryMedium: "EMAIL",
                        destination: email
                    }
                }
            }
        }, // Function to start the password reset process
        completeSignIn: withLatency(async (username, password) => {
            if (storyArgs.signInErrorType) {
                const e = new Error(storyArgs.signInErrorMessage || "Some error occurred");
                e.name = storyArgs.signInErrorType;
                throw e;
            }

            storyArgs.completeSignIn(username, password);
            alert("You would now be signed in and redirected to the app");
        }), // Function to sign in
        completeSignUp: storyArgs.completeSignIn, // Function to sign up
        completePasswordReset: async (username, newPassword, confirmationCode) => {
            storyArgs.completePasswordReset(username, newPassword, confirmationCode);
            navigate(SignInPath);
            setMessage("Your password has been reset. Please sign in with your new password.");
        }, // Function to reset password
        authenticationNeeded, // Whether authentication is needed after attempting automatic sign-in
        authStep, // Current authentication step
        setAuthStep // Function to change the authentication step
    }

    return (
        <AuthContext.Provider value={auth}>
            <AuthSignUpContext.Provider value={auth as AuthSignUpContextType}>
                <AuthSignInContext.Provider value={auth as AuthSignInContextType}>
                    <AuthPasswordResetContext.Provider value={auth as AuthPasswordResetContextType}>
                        <AuthenticationView navigate={navigate}/>
                    </AuthPasswordResetContext.Provider>
                </AuthSignInContext.Provider>
            </AuthSignUpContext.Provider>
        </AuthContext.Provider>
    );
};

type AuthenticatorArgs = {
    buttonClicked: () => void;
    startSignUp: (email: string, password: string, passwordConfirm: string) => Promise<any>;
    startPasswordReset: () => void;
    completeSignIn: (username: string, password: string) => Promise<any>;
    completePasswordReset: (username: string, code: string, newPassword: string) => Promise<any>;
    submitAuth: () => void;
    navigate: (path: string) => void;
    latency: number;
    signInErrorType?: string;
    signInErrorMessage?: string;
    signUpErrorType?: string;
    confirmSignUpError?: string;
    resetPasswordError?: string;
}

export const Authenticator: ((args: any) => Element) & {
    args: AuthenticatorArgs
} = AuthenticatorTemplate.bind({}) as any;
Authenticator.args = {
    completePasswordReset: fn(),
    buttonClicked: fn(),
    startSignUp: fn(),
    startPasswordReset: fn(),
    completeSignIn: fn(),
    submitAuth: fn(),
    navigate: fn(),
    latency: 500,
    signInErrorType: "",
    signInErrorMessage: "",
    signUpErrorType: "",
    confirmSignUpError: "",
    resetPasswordError: ""
};

export const AuthenticationError: ((args: any) => Element) & {
    args: AuthenticatorArgs
} = AuthenticatorTemplate.bind({}) as any;
AuthenticationError.args = {...Authenticator.args,
    signInErrorType: "NotAuthorizedException",
    signInErrorMessage: "Incorrect username or password"
};

// TODO: Extract the actual layout from the component so there's no need to coordinate these places
/**
 * Wrapper for the subcomponents to show them in a modal as though they were embedded in the Authenticator
 */
export const ContainerTemplate = ({children}) => (
    <Modal open={true}>
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            <Box sx={{width: 400, bgcolor: "background.paper", border: "2px solid #000", boxShadow: 24, p: 4}}>
                <Stack sx={{flexGrow: 1, justifyContent: "center", alignContent: "center"}} spacing={3}>
                    <ToggleButtonGroup exclusive value={SignUpPath}
                                       sx={{justifyContent: "center", alignContent: "center"}}>
                        <Stack direction="row" spacing={1}>
                            <ToggleButton value={SignInPath}>Sign In</ToggleButton>
                            <ToggleButton value={SignUpPath}>Sign Up</ToggleButton>
                        </Stack>
                    </ToggleButtonGroup>
                    {children}
                </Stack>
            </Box>
        </Box>
    </Modal>)