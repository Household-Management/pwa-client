import './App.css';
import {Provider} from 'react-redux'
import React, {useContext, useEffect} from "react";
import {Amplify} from "aws-amplify";
import outputs from "../amplify_outputs";
import {store} from "./redux/store";
import {HeaderProvider} from "./layout/hooks/HeaderContext";
import {RouterProvider} from "react-router";
import {router} from "./navigation/configuration/routing";
import ConfigurationService from "./config/ConfigurationService";
import {CookiesProvider} from "react-cookie";
import {parseAmplifyConfig} from "aws-amplify/utils";
import {MonitoringAllowed, MonitoringNotSet} from "./monitoring/Monitoring";
import MonitoringConsent from "./monitoring/components/MonitoringConsent";
import {Dialog, DialogContent} from "@mui/material";


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

export const monitoringContext = React.createContext({});

// TODO: Implement notifications for tasks.
function App() {
    const [monitoringConsentRequired, setMonitoringConsentRequired] = React.useState(MonitoringNotSet());
    useEffect(() => {
        if (MonitoringAllowed()) {
            console.log("Enabling RUM due to user preference");
            window.awsRum?.enable();
        } else {
            console.log("Disabling RUM due to user preference");
            window.awsRum?.disable();
        }
    }, [monitoringConsentRequired])

    return (<div className="App" style={{display: "flex", flexDirection: "column", height: "100vh"}}>
        <monitoringContext.Provider value={{monitoringConsentRequired, setMonitoringConsentRequired}}>
            <Provider store={store}>
                <HeaderProvider>
                    <CookiesProvider>
                        <RouterProvider router={router}/>
                    </CookiesProvider>
                </HeaderProvider>
            </Provider>
        </monitoringContext.Provider>
        <Dialog open={monitoringConsentRequired}>
            <DialogContent>
                <MonitoringConsent onComplete={() => {
                    setMonitoringConsentRequired(MonitoringNotSet());
                }}/>
            </DialogContent>
        </Dialog>
    </div>);

}

export default App;
