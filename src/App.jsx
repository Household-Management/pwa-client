import './App.css';
import {Provider} from 'react-redux'
import React, {useContext} from "react";
import {Amplify} from "aws-amplify";
import outputs from "../amplify_outputs";
import {store} from "./redux/store";
import {HeaderProvider} from "./layout/hooks/HeaderContext";
import {RouterProvider} from "react-router";
import {router} from "./navigation/configuration/routing";
import {DataClientContext} from "./graphql/DataClient";
import {CookiesProvider} from "react-cookie";

console.log("Loading state from window");

Amplify.configure(outputs);

// TODO: Implement notifications for tasks.
function App() {
    return (<div className="App" style={{display: "flex", flexDirection: "column", height: "100vh"}}>
        <Provider store={store}>
            <HeaderProvider>
                <CookiesProvider>
                    <RouterProvider router={router}/>
                </CookiesProvider>
            </HeaderProvider>
        </Provider>
    </div>);

}

export default App;
