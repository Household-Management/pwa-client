import {Context, createContext} from "react";
import {ConfirmSignUpOutput, SignUpOutput} from "@aws-amplify/auth";
import {AuthenticationPath, AuthStep} from "./AppAuthenticator.tsx";
import {SignInOutput, ResetPasswordOutput} from "aws-amplify/auth";

export type AuthGlobalContextType = AuthSignInContextType & AuthSignUpContextType & AuthPasswordResetContextType;

export type AuthContextType = {
    tab: AuthenticationPath;
    message?: string;
    setMessage: (message?: string) => void;
    email: string;
    setEmail: (email: string) => void;

    password?: string;
    setPassword: (password: string) => void;

    authStep: AuthStep;
    setAuthStep: (step: AuthStep) => void;
}

export type AuthSignUpContextType = AuthContextType & {
    startSignup: (email: string, password: string, passwordConfirm: string) => Promise<SignUpOutput>;
    completeSignUp: (username: string, confirmCode: string) => Promise<ConfirmSignUpOutput | void>;
}

export type AuthSignInContextType = AuthContextType & {
    completeSignIn: (username: string, password: string) => Promise<SignInOutput | void>;

    authenticationNeeded: boolean;
    startPasswordReset: () => Promise<ResetPasswordOutput>;
}

export type AuthPasswordResetContextType = AuthContextType & {
    completePasswordReset: (username: string, newPassword: string, confirmationCode: string) => Promise<void>;
}

const AuthContext: Context<AuthGlobalContextType> = createContext({} as any);
const AuthSignUpContext: Context<AuthSignUpContextType> = createContext({} as any);
const AuthSignInContext: Context<AuthSignInContextType> = createContext({} as any);
const AuthPasswordResetContext: Context<AuthPasswordResetContextType> = createContext({} as any);

export {AuthSignUpContext, AuthSignInContext, AuthPasswordResetContext};

export default AuthContext;