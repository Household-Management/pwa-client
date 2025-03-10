import './App.css';
import {Provider} from 'react-redux'
import React, {useContext} from "react";
import {Amplify} from "aws-amplify";
import outputs from "../amplify_outputs";
import {store} from "./redux/store";
import AppAuthenticator from "./authentication/components/AppAuthenticator";
import {HeaderProvider} from "./layout/hooks/HeaderContext";
import {RouterProvider} from "react-router";
import {router} from "./navigation/configuration/routing";

console.log("Loading state from window");

Amplify.configure(outputs);

// TODO: Implement notifications for tasks.
// TODO: Implement settings page.
function App() {
    return (<div className="App" style={{display: "flex", flexDirection: "column", height: "100vh"}}>
        <Provider store={store}>
            <AppAuthenticator>
                <HeaderProvider>
                    <RouterProvider router={router}/>
                </HeaderProvider>
            </AppAuthenticator>
        </Provider>
    </div>);

}

export default App;
