import {defineFunction, Backend} from "@aws-amplify/backend";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {ConstructFactory} from "@aws-amplify/plugin-types";

import { BackendType} from "../backend";

export type ConfigurableFunction = ConstructFactory<any> & { configure?: (backend: Backend<BackendType>) => void };

export const inviteFunction: ConfigurableFunction = defineFunction({
    name: "InviteToHousehold",
    entry: "./generate-invite-code/handler.js",
    resourceGroupName: "data"
});
// FIXME: Extend types to avoid ts-ignore

inviteFunction.configure = (backend: Backend<any>) => {
    backend.inviteFunction.resources.cfnResources.cfnFunction.environment = {
        variables: {
            HOUSEHOLD_TABLE_NAME: backend.data.resources.tables["Household"].tableName,
            HOUSEHOLD_INVITE_TABLE_NAME: backend.data.resources.tables["HouseholdInvite"].tableName
        }
    };

    backend.inviteFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [backend.data.resources.tables["Household"].tableArn]
    }));

    backend.inviteFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:Query"],
        resources: [
            backend.data.resources.tables["HouseholdInvite"].tableArn,
            `${backend.data.resources.tables["HouseholdInvite"].tableArn}/index/householdInvitesByHouseholdId`]
    }));
}

export const joinFunction:ConfigurableFunction = defineFunction({
    name: "JoinHousehold",
    entry: "./join-with-invite-code/handler.js",
    resourceGroupName: "data"
});
joinFunction.configure = (backend: Backend<any>) => {
    backend.joinFunction.resources.cfnResources.cfnFunction.environment = {
        variables: {
            HOUSEHOLD_TABLE_NAME: backend.data.resources.tables["Household"].tableName,
            HOUSEHOLD_INVITE_TABLE_NAME: backend.data.resources.tables["HouseholdInvite"].tableName,
        }
    }

    backend.joinFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
        resources: [
            backend.data.resources.tables["Household"].tableArn,
        ]
    }));

    backend.joinFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:DeleteItem"],
        resources: [backend.data.resources.tables["HouseholdInvite"].tableArn]
    }));

    backend.joinFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ["cognito-idp:AdminAddUserToGroup"],
        resources: [
            backend.auth.resources.userPool.userPoolArn
        ]
    }));
}

export const createHouseholdFunction: ConfigurableFunction = defineFunction({
    name: "CreateHousehold",
    entry: "./create-household/handler.ts",
    resourceGroupName: "data"
});

createHouseholdFunction.configure = (backend: Backend<BackendType>) => {
    backend.createHouseholdFunction.resources.cfnResources.cfnFunction.environment = {
        variables: {
            HOUSEHOLD_TABLE_NAME: backend.data.resources.tables["Household"].tableName,
            HOUSEHOLD_INVITE_TABLE_NAME: backend.data.resources.tables["HouseholdInvite"].tableName,
            HOUSEHOLD_TASKS_TABLE_NAME: backend.data.resources.tables["HouseholdTasks"].tableName,
            KITCHEN_TABLE_NAME: backend.data.resources.tables["Kitchen"].tableName,
            HOUSEHOLD_RECIPES_TABLE_NAME: backend.data.resources.tables["HouseholdRecipes"].tableName,
            TASK_LIST_TABLENAME: backend.data.resources.tables["TaskList"].tableName,
            COGNITO_USER_POOL_ID: backend.auth.resources.userPool.userPoolId
        }
    };

    backend.createHouseholdFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:PutItem"],
        resources: [
            backend.data.resources.tables["Household"].tableArn,
            backend.data.resources.tables["HouseholdTasks"].tableArn,
            backend.data.resources.tables["Kitchen"].tableArn,
            backend.data.resources.tables["HouseholdRecipes"].tableArn,
            backend.data.resources.tables["TaskList"].tableArn,
        ]
    }));

    backend.createHouseholdFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ["cognito-idp:CreateGroup", "cognito-idp:AdminAddUserToGroup"],
        resources: [
            backend.auth.resources.userPool.userPoolArn
        ]
    }));
}

export const fetchConfigurationFunction: ConfigurableFunction = defineFunction({
    name: "FetchConfiguration",
    entry: "./fetch-configuration/handler.ts",
    resourceGroupName: "data"
});

fetchConfigurationFunction.configure = (backend: Backend<BackendType>) => {
    const lambdaFunction: lambda.Function = backend.fetchConfigurationFunction.resources.lambda;
    lambdaFunction.addToRolePolicy(new iam.PolicyStatement(
        {
            actions: [
                "appconfig:GetLatestConfiguration",
                "appconfig:StartConfigurationSession"
            ],
            resources: [`arn:aws:appconfig:${backend.stack.region}:${backend.stack.account}:application/2j0vk1v/environment/*/configuration/*`]
        }
    ));
    const extensionLayer = lambda.LayerVersion.fromLayerVersionArn(lambdaFunction, 'AppConfigExtensionLayer', 'arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension:207');
    lambdaFunction.addLayers(extensionLayer);
};