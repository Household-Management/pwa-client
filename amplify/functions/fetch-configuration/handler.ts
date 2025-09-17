import {APIGatewayProxyHandler, APIGatewayProxyEvent} from "aws-lambda";


export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent) => {
    const { application, environment, configurationProfile } = event.pathParameters || {};

    if(!application) {
        throw new Error("Missing required path parameter 'application'");
    }

    if(application && !environment) {
        throw new Error("Missing required path parameter 'configurationProfile'");
    }

    if(configurationProfile) {
        console.log("Fetching configuration profile", configurationProfile);
    } else {
        console.log("Fetching public configuration");
    }
    const path = !configurationProfile ? `http://localhost:2772/applications/${application}/environments/${environment}/configurations/public` :
        `http://localhost:2772/applications/${application}/environments/${environment}/configurations/${configurationProfile}`;

    const config = await fetch(path, {
        method: 'GET',
        headers : {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    });

    if(!config.ok) {
        throw new Error(`Failed to fetch configuration: ${config.statusText}`);
    }

    return {
        statusCode: 200,
        body: await config.text(),
        headers: {
            "Vary": "Origin",
            "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Content-Type": "application/json"
        }
    }
}