import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json"
import { generateClient } from "aws-amplify/data";
import {createContext} from "react";

Amplify.configure(outputs);
const dataClient = generateClient({
    authMode: "userPool"
});

export const DataClientContext = createContext(dataClient);