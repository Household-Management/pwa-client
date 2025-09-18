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
if(import.meta.env.VITE_ENABLE_RUM === 'true') {
    try {
        console.log("Enabling RUM");
        const config = {
            sessionSampleRate: 1,
            endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
            telemetries: ["performance", "errors", "http"],
            allowCookies: false,
            enableXRay: false,
            signing: true // If you have a public resource policy and wish to send unsigned requests please set this to false
        };

        const APPLICATION_ID = '0eae084b-3d29-481c-a189-3b236c539304';
        const APPLICATION_VERSION = '1.0.0';
        const APPLICATION_REGION = 'us-east-1';

        const awsRum = new AwsRum(
            APPLICATION_ID,
            APPLICATION_VERSION,
            APPLICATION_REGION,
            config
        );
        window.awsRum = awsRum;
    } catch (error) {
        console.error(error);
    }
} else {
    console.log("RUM not enabled");
}

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
