import SignIn from "./SignIn";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import {MemoryRouter} from "react-router-dom";
import {fn} from "storybook/test";
import {ContainerTemplate} from "./AppAuthenticator.stories.jsx";
import {useState} from "react";
import {AuthSignInContext} from "./AuthenticationContext.ts";
import {AuthStep} from "./AppAuthenticator.tsx";
import {SignInOutput} from "aws-amplify/auth";

const store = configureStore({
    reducer: state => state || {}
});

export default {
    title: "Authentication/Elements/SignIn",
    render: _args => {
        const [email, setEmail] = useState(_args.email);
        const [password, setPassword] = useState(_args.password);
        const [authStep, setAuthStep] = useState<AuthStep>("BEGIN_SIGN_IN");

        const auth = {
            email,
            setEmail,
            password,
            setPassword,
            authStep,
            setAuthStep,
            completeSignIn: async (email: string, password: string): Promise<SignInOutput | undefined> => {
                if (_args.loadTime) {
                    await new Promise(resolve => setTimeout(resolve, _args.loadTime));
                }

                _args.onSubmit(email, password);
                if (_args.submitError) {
                    const error = new Error(_args.submitError);
                    (error as any).name = "NotAuthorizedException";
                    throw error;
                }
                alert("This is when you would be redirected after signing in");
                return {
                    isSignedIn: true,
                    nextStep: {
                        signInStep: "DONE"
                    }
                };
            },
            startPasswordReset: () => {
                alert("This is when you would be taken to the password reset screen");
            },
            authenticationNeeded: false
        }
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={["/sign-in"]}>
                    <AuthSignInContext.Provider value={auth}>
                        <ContainerTemplate>
                            <SignIn/>
                        </ContainerTemplate>
                    </AuthSignInContext.Provider>
                </MemoryRouter>
            </Provider>
        );
    },
    args: {
        email: "email@website.com",
        password: "password123",
        loadTime: 1000,
        onSubmit: fn()
    }
};

type SignInArgs = {
    loadTime: number,
    onSubmit?: (email: string, password: string) => void,
    submitError?: string
}

export const SignInComponent: { args: SignInArgs } = {
    args: {
        loadTime: 1000,
        onSubmit: fn()
    }
};

export const AuthenticationError: { args: SignInArgs } = {
    args: {
        loadTime: 1000,
        submitError: "Username or password is incorrect",
    }
}