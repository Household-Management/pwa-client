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

const AuthenticatorTemplate = (args) => {
    const location = useLocation();
    const doNavigate = useNavigate();
    const navigate = (path: string) => {
        args.navigate(path);
        doNavigate(path);
    }
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState("");
    const [authStep, setAuthStep] = useState<AuthStep>("BEGIN_SIGN_IN");
    const [authenticationNeeded] = useState(false);
    let tab: AuthenticationPath = location.pathname as any;

    const auth: AuthSignUpContextType & AuthSignInContextType & AuthPasswordResetContextType = {
        tab, // Which tab is shown
        email, // The email address from the user
        setEmail, // Change the email address
        message, // Message to show to the user
        setMessage, // Change the message
        password,
        setPassword,
        startSignup: args.startSignUp, // Function to start the sign-up process
        startPasswordReset: async (): Promise<ResetPasswordOutput> => {
            args.startPasswordReset();
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
        completeSignIn: args.completeSignIn, // Function to sign in
        completeSignUp: args.completeSignIn, // Function to sign up
        completePasswordReset: async (username, newPassword, confirmationCode) => {
            args.completePasswordReset(username, newPassword, confirmationCode);
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
    navigate: fn()
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