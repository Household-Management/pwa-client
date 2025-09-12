import {APIGatewayProxyHandler, APIGatewayProxyEvent} from "aws-lambda";


export const handler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent) => {
    const { application, environment, configurationProfile } = event.pathParameters || {};

    const config = await fetch(`http://localhost:2772/applications/${application}/environments/${environment}/configurations/${configurationProfile}`, {
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
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Content-Type": "application/json"
        }
    }
}