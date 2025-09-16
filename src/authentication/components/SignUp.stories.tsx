import {useState} from "react";
import {AuthSignUpContext, AuthSignUpContextType} from "./AuthenticationContext.ts";
import {AuthStep} from "./AppAuthenticator.tsx";
import SignUp from "./SignUp.tsx";
import {fn, Mock} from "storybook/test";
import {ConfirmSignUpOutput, SignUpOutput} from "@aws-amplify/auth";
import {ContainerTemplate} from "./AppAuthenticator.stories.jsx";

export default {
    title: "Authentication/Elements/SignUp",
    component: <SignUp/>
};

const SignUpTemplate = (args: any) => {
    const [email, setEmail] = useState(args.email);
    const [password, setPassword] = useState(args.password);
    const [authStep, setAuthStep] = useState<AuthStep>("BEGIN_SIGN_UP");
    const auth: AuthSignUpContextType = {
        email,
        setEmail,
        password,
        setPassword,
        authStep,
        setAuthStep,
        startSignup: async (email, password, confirmPassword): Promise<SignUpOutput> => {
            if (args.latencyPause) {
                await new Promise(resolve => setTimeout(resolve, args.latencyPause));
            }
            if (args.startSignupError) {
                throw new Error(args.startSignupError);
            }
            args.startSignup(email, password, confirmPassword);
            setAuthStep("CONFIRM_SIGN_IN_WITH_PASSWORD");
            return {
                isSignUpComplete: false,
                nextStep: {
                    signUpStep: "CONFIRM_SIGN_UP",
                    codeDeliveryDetails: {
                        attributeName: "email",
                        deliveryMedium: "EMAIL",
                        destination: email
                    }
                }

            }
        },
        completeSignUp: async (email, code): Promise<ConfirmSignUpOutput> => {
            if (args.latencyPause) {
                await new Promise(resolve => setTimeout(resolve, args.latencyPause));
            }
            if (args.confirmSignUpError) {
                throw new Error(args.confirmSignUpError);
            }
            args.completeSignUp(email, code);
            alert("This is when you would be redirected after signing in");
            return {
                nextStep: {
                    signUpStep: "DONE"
                },
                isSignUpComplete: true
            };
        }
    };

    return (
        <ContainerTemplate>
            <AuthSignUpContext.Provider value={auth}>
                <SignUp/>
            </AuthSignUpContext.Provider>
        </ContainerTemplate>
    );
};

type SignUpArgs = {
    startSignup: Mock,
    completeSignUp: Mock,
    completeSignIn: Mock,
    latencyPause: number,
    startSignupError: string,
    confirmSignUpError: string,
    email: string,
    password: string
}

export const Default = SignUpTemplate.bind({}) as unknown as ((args: any) => Element) & { args: SignUpArgs };

Default.args = {
    startSignup: fn(),
    completeSignUp: fn(),
    completeSignIn: fn(),
    latencyPause: 1000,
    email: "email@website.com",
    password: "password123",
    startSignupError: "", // Error thrown when starting the sign up process
    confirmSignUpError: "" // Error thrown when confirming the sign up process
};

export const StartSignUpError = SignUpTemplate.bind({}) as unknown as ((args: any) => Element) & { args: SignUpArgs };

StartSignUpError.args = {
    ...Default.args,
    startSignupError: "An error occurred when trying to start signup", // Error thrown when starting the sign up process
};

export const ConfirmSignUpError = SignUpTemplate.bind({}) as unknown as ((args: any) => Element) & { args: SignUpArgs };

ConfirmSignUpError.args = {
    ...Default.args,
    confirmSignUpError: "An error occurred when trying to confirm signup" // Error thrown when confirming the sign up process
};