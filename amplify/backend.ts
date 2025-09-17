import {Backend, defineBackend} from '@aws-amplify/backend';

import {auth} from './auth/resource';
import {data} from './data/resource';
import {createHouseholdFunction, fetchConfigurationFunction, inviteFunction, joinFunction} from "./functions/resource";
import {cognitoUserPoolsTokenProvider} from 'aws-amplify/auth/cognito';
import {CookieStorage} from 'aws-amplify/utils';
import {
    AuthorizationType,
    CognitoUserPoolsAuthorizer,
    Cors,
    LambdaIntegration,
    RestApi
} from 'aws-cdk-lib/aws-apigateway';
import * as iam from "aws-cdk-lib/aws-iam";
import {Stack} from 'aws-cdk-lib';
import {AmplifyClient, ListDomainAssociationsCommand} from "@aws-sdk/client-amplify";
import * as dotenv from 'dotenv';

// TODO: Generate local configuration files for sandboxes.
dotenv.config({
    path: [".env.local", ".env"]
});

async function getAmplifyDomain(appId: string, region: string, branch: string): Promise<string[]> {
    const amplify = new AmplifyClient({ region });
    const command = new ListDomainAssociationsCommand({ appId });
    const response = await amplify.send(command);
    return response.domainAssociations?.map(domain => {
        // @ts-ignore
        return `https://${domain.subDomains[0].subDomainSetting.prefix}.${domain.domainName}`;
    }) || [];
}

export type BackendType = {
    auth: typeof auth,
    data: typeof data,
    inviteFunction: typeof inviteFunction,
    joinFunction: typeof joinFunction,
    createHouseholdFunction: typeof createHouseholdFunction,
    fetchConfigurationFunction: typeof fetchConfigurationFunction,
}

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend:Backend<BackendType> = defineBackend({
    inviteFunction,
    joinFunction,
    createHouseholdFunction,
    fetchConfigurationFunction,
    auth,
    data,
});
// TODO: A backend function to delete non-repeating completed tasks in the past

if (inviteFunction.configure) {
    inviteFunction.configure(backend);
}

if (joinFunction.configure) {
    joinFunction.configure(backend);
}

if (createHouseholdFunction.configure) {
    createHouseholdFunction.configure(backend);
}

if (fetchConfigurationFunction.configure) {
    fetchConfigurationFunction.configure(backend);
}

const appId = process.env.VITE_AMPLIFY_APP_ID as string; // Set this in your environment variables
const region = process.env.VITE_AWS_REGION as string; // Set this in your environment variables
const branch = process.env.AWS_BRANCH as string; // Set this in your environment variables
if(!appId) {
    throw new Error("Missing required app id environment variable VITE_AMPLIFY_APP_ID");
}
if(!region) {
    throw new Error("Missing required region environment variable VITE_AWS_REGION");
}
if(!branch) {
    throw new Error("Missing required branch environment variable VITE_AWS_BRANCH");
}
// const domains: string[] = [...await getAmplifyDomain(appId, region, branch), "*"];

const apiStack = backend.createStack("APIStack");
//TODO: Support using GET with path parameters
const restAPI = new RestApi(apiStack, 'MyApi', {
    restApiName: 'Household Service',
    description: 'This service serves household management.',
    deploy: true,
    deployOptions: {
        stageName: 'staging',
    },
    defaultCorsPreflightOptions: {
        allowOrigins: ["*"], // Restrict this to domains you trust
        allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
        allowHeaders:["*"], // Specify only the headers you need to allow,
        disableCache: true
    }
});

//TODO: Move this configuration API to its own file
const configPath = restAPI.root.addResource("config", {
    defaultMethodOptions: {
        authorizationType: AuthorizationType.COGNITO
    }
});
const applicationPath = configPath.addResource("{application}");
const environmentPath = applicationPath.addResource("{environment}");
const configurationPath = environmentPath.addResource("{configurationProfile}");

const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, 'CognitoAuthorizer', {
    cognitoUserPools: [backend.auth.resources.userPool]
});

const lambdaIntegration = new LambdaIntegration(backend.fetchConfigurationFunction.resources.lambda);

environmentPath.addMethod("GET", lambdaIntegration, {
    authorizationType: AuthorizationType.NONE
});

configurationPath.addMethod("GET", lambdaIntegration, {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: cognitoAuth
});

const restApiAccessPolicy = new iam.Policy(apiStack, "RestApiAccessPolicy", {
    statements: [
        new iam.PolicyStatement({
            actions: ["execute-api:Invoke"],
            resources: [`${restAPI.arnForExecuteApi("*", "/* ", "*")}`]
        })
    ]
});

backend.addOutput({
    custom: {
        API: {
            [restAPI.restApiName] : {
                endpoint: restAPI.url,
                region: Stack.of(apiStack).region,
                apiName: restAPI.restApiName
            }
        }
    }
})

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(restApiAccessPolicy);

cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());