import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AwsRum} from "aws-rum-web";
import {MonitoringAllowed} from "./monitoring/Monitoring";

if(import.meta.env.VITE_ENABLE_RUM === 'true') {
    try {
        console.log("Enabling RUM");
        const config = {
            sessionSampleRate: 1 ,
            identityPoolId: import.meta.env.VITE_RUM_IDENTITY_POOL_ID ,
            endpoint: "https://dataplane.rum.us-east-1.amazonaws.com" ,
            telemetries: (import.meta.env.VITE_RUM_TELEMETRIES || "").split(","),
            allowCookies: false ,
            enableXRay: false ,
            signing: true // If you have a public resource policy and wish to send unsigned requests please set this to false
        };

        const APPLICATION_ID = import.meta.env.VITE_RUM_APPLICATION_ID ;
        const APPLICATION_VERSION = import.meta.env.VITE_RUM_APPLICATION_VERSION;
        const APPLICATION_REGION = 'us-east-1';

        window.awsRum = new AwsRum(
            APPLICATION_ID,
            APPLICATION_VERSION,
            APPLICATION_REGION,
            config
        );
        if(!MonitoringAllowed()) {
            console.log("RUM disabled due to user preference");
            window.awsRum.disable();
        }
    } catch (error) {
        console.error(error);
    }
} else {
    console.log("RUM not enabled");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
