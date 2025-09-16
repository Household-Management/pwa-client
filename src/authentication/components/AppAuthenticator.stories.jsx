import React, {useState} from "react";
import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import {MemoryRouter, useNavigate} from "react-router-dom";
import AuthContext from "./AuthenticationContext";
import {AuthenticationView} from "./AppAuthenticator";
import {Box, Modal, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {fn} from "storybook/test";
import PasswordReset from "./PasswordReset";
import SignIn from "./SignIn";

const store = configureStore({
    reducer: (state) => state || {user: null},
});

export default {
    title: "Authentication/Authenticator",
    component: AuthenticationView,
    decorators: [
        (Story) => (
            <Provider store={store}>
                <MemoryRouter initialEntries={["/sign-in"]}>
                    <Box sx={{height: "100vh", width: "100vw"}}>
                        <Story/>
                    </Box>
                </MemoryRouter>
            </Provider>
        ),
    ],
};

const AuthenticatorTemplate = (args) => {
    const [tab, setTab] = useState("/sign-in");
    const [email, setEmail] = useState("");
    const [authStep, setAuthStep] = useState("BEGIN_SIGN_IN");
    const [authenticationNeeded, setAuthenticationNeeded] = useState(false);

    const auth = {
        tab, // Which tab is shown
        email, // The email address from the user
        setEmail, // Change the email address
        startSignup: args.startSignUp, // Function to start the sign-up process
        startPasswordReset: args.startPasswordReset, // Function to start the password reset process
        completeSignIn: args.completeSignIn, // Function to sign in
        completeSignUp: args.completeSignIn, // Function to sign up
        completePasswordReset: args.completePasswordReset, // Function to reset password
        authenticationNeeded, // Whether authentication is needed after attempting automatic sign-in
        authStep, // Current authentication step
        setAuthStep // Function to change the authentication step
    }

    return (
        <AuthContext.Provider value={auth}>
            <AuthenticationView/>
        </AuthContext.Provider>
    );
};

export const Authenticator = AuthenticatorTemplate.bind({});
Authenticator.args = {
    buttonClicked: fn(),
    startSignUp: fn(),
    startPasswordReset: fn(),
    completeSignIn: fn(),
    submitAuth: fn(),
    navigate: fn()
};

const SignInTemplate = (args) => {
    const [email, setEmail] = useState("");
    const auth = {
        email,
        setEmail,
        completeSignIn: (username, password) => {
            args.completeSignIn(username, password)
            if(password !== args.correctPassword || username !== args.correctEmail) {
                const e = new Error("Incorrect username or password.");
                e.name = "NotAuthorizedException";
                throw e;
            }
        },
        startPasswordReset: args.startPasswordReset,
    };

    return (
        <Modal open={true}>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                <Box sx={{width: 400, bgcolor: "background.paper", border: "2px solid #000", boxShadow: 24, p: 4}}>
                    <Stack spacing={3}>
                        <ToggleButtonGroup exclusive value="/sign-in"
                                           sx={{justifyContent: "center", alignContent: "center"}}>
                            <Stack direction="row" spacing={1}>
                                <ToggleButton value="/sign-in">Sign In</ToggleButton>
                                <ToggleButton value="/sign-up">Sign Up</ToggleButton>
                            </Stack>
                        </ToggleButtonGroup>
                        <AuthContext.Provider value={auth}>
                            <SignIn/>
                        </AuthContext.Provider>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};

export const SignInStory = SignInTemplate.bind({});
SignInStory.args = {
    completeSignIn: fn(),
    startPasswordReset: fn(),
    correctEmail: "test@email.com",
    correctPassword: "password123"
};

const PasswordResetTemplate = (args) => {
    return (
        <Modal open={true}>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                <Box sx={{width: 400, bgcolor: "background.paper", border: "2px solid #000", boxShadow: 24, p: 4}}>
                    <Stack sx={{flexGrow: 1, justifyContent: "center", alignContent: "center"}} spacing={3}>
                        <ToggleButtonGroup sx={{justifyContent: "center", alignContent: "center"}} exclusive value="/reset-password">
                            <ToggleButton value="/sign-in">Sign In</ToggleButton>
                            <ToggleButton value="/sign-up">Sign Up</ToggleButton>
                        </ToggleButtonGroup>
                        <PasswordReset email={args.email}/>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    );
};

// export const PasswordResetStory = PasswordResetTemplate.bind({});
// PasswordResetStory.args = {
//     email: "test@example.com",
// };