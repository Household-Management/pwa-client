import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AwsRum} from "aws-rum-web";

if(import.meta.env.VITE_ENABLE_RUM === 'true') {
    try {
        console.log("Enabling RUM");
        const config = {
            sessionSampleRate: 1 ,
            identityPoolId: "us-east-1:aa8abcd5-19db-47b8-8008-58760979daf1" ,
            endpoint: "https://dataplane.rum.us-east-1.amazonaws.com" ,
            telemetries: ["performance","errors","http"] ,
            allowCookies: false ,
            enableXRay: false ,
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
        awsRum.recordPageView();
        window.awsRum = awsRum;
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
