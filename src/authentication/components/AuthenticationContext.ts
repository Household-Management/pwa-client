import {Context, createContext} from "react";
import {ConfirmSignUpOutput, SignUpOutput} from "@aws-amplify/auth";
import {AuthStep} from "./AppAuthenticator.tsx";
import {SignInOutput} from "aws-amplify/auth";


export type AuthContextType = {
    email: string;
    setEmail: (email: string) => void;

    password?: string;
    setPassword?: (password: string) => void;

    authStep: AuthStep;
    setAuthStep: (step: AuthStep) => void;
}

export type AuthSignUpContextType = AuthContextType & {
    startSignup: (email: string, password: string, passwordConfirm: string) => Promise<SignUpOutput>;
    completeSignUp: (username: string, confirmCode: string) => Promise<ConfirmSignUpOutput | undefined>;
}

export type AuthSignInContextType = AuthContextType & {
    completeSignIn: (username: string, password: string) => Promise<SignInOutput | undefined>;

    authenticationNeeded: boolean;
    startPasswordReset: () => void;
}

export type AuthPasswordResetContextType = AuthContextType & {
    completePasswordReset: (username: string) => Promise<void>;
}

const AuthContext: Context<AuthContextType> = createContext({} as any);
const AuthSignUpContext: Context<AuthSignUpContextType> = createContext({} as any);
const AuthSignInContext: Context<AuthSignInContextType> = createContext({} as any);
const AuthPasswordResetContext: Context<AuthPasswordResetContextType> = createContext({} as any);

export {AuthSignUpContext, AuthSignInContext, AuthPasswordResetContext};

export default AuthContext;