import './App.css';
import {Provider} from 'react-redux'
import React, {useContext} from "react";
import {Amplify} from "aws-amplify";
import outputs from "../amplify_outputs";
import {store} from "./redux/store";
import {HeaderProvider} from "./layout/hooks/HeaderContext";
import {RouterProvider} from "react-router";
import {router} from "./navigation/configuration/routing";
import ConfigurationService from "./config/ConfigurationService";
import {CookiesProvider} from "react-cookie";
import {parseAmplifyConfig} from "aws-amplify/utils";
import {AwsRum} from 'aws-rum-web';


const amplifyConfiguration = parseAmplifyConfig(outputs);

// This bypasses the parsing logic of Amplify, which only supports GraphQL. We trick amplify into using the underlying API.
Amplify.configure(
    {
        ...amplifyConfiguration,
        API: {
            ...amplifyConfiguration.API,
            REST: outputs.custom.API
        }
    },
    {
        API: {
            REST: {
                retryStrategy: "no-retry"
            }
        }
    });

ConfigurationService.loadConfiguration();

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
