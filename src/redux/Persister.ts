import AppState from "./AppState";
import Client from "../data/AmplifyClient";
import {UnknownAction} from "redux";

/**
 * A function used in Redux middleware to persist state changes to the backend. What "persist" means is up to the
 * implementation, it can be creating, updating or deleting.
 *
 * @param item - The item to be persisted.
 */
export type Persister = (client: typeof Client, state: AppState, action: UnknownAction & {
    payload: any
}) => Promise<void>;
// TODO: I want to be able to use the Amplify model types here, but Typescript complains about too deep recursion.
// export type Persister<M extends typeof Client.models[keyof typeof Client.models]> = (client: typeof Client, state: AppState, action: UnknownAction & {
//     payload: Parameters<M["create"]> | Parameters<M["update"]> | Parameters<M["delete"]>
// }) => Promise<void>;

