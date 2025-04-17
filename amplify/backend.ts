import {defineBackend} from '@aws-amplify/backend';
import * as iam from "aws-cdk-lib/aws-iam";
import {auth} from './auth/resource';
import {data} from './data/resource';
import {inviteFunction, joinFunction, createHouseholdFunction} from "./functions/resource";
import {cognitoUserPoolsTokenProvider} from 'aws-amplify/auth/cognito';
import {CookieStorage} from 'aws-amplify/utils';


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
    inviteFunction,
    joinFunction,
    createHouseholdFunction,
    auth,
    data,
});

backend.inviteFunction.resources.cfnResources.cfnFunction.environment = {
    variables: {
        HOUSEHOLD_TABLE_NAME: backend.data.resources.tables["Household"].tableName,
        HOUSEHOLD_INVITE_TABLE_NAME: backend.data.resources.tables["HouseholdInvite"].tableName,
        HOUSEHOLD_TASKS_TABLE_NAME: backend.data.resources.tables["HouseholdTasks"].tableName,
        KITCHEN_TABLE_NAME: backend.data.resources.tables["Kitchen"].tableName,
        HOUSEHOLD_RECIPES_TABLE_NAME: backend.data.resources.tables["HouseholdRecipes"].tableName,
        TASK_LIST_TABLE_NAME: backend.data.resources.tables["TaskList"].tableName,
    }
};

backend.createHouseholdFunction.resources.cfnResources.cfnFunction.environment = {
    variables: {
        HOUSEHOLD_TABLE_NAME: backend.data.resources.tables["Household"].tableName,
        HOUSEHOLD_INVITE_TABLE_NAME: backend.data.resources.tables["HouseholdInvite"].tableName,
        HOUSEHOLD_TASKS_TABLE_NAME: backend.data.resources.tables["HouseholdTasks"].tableName,
        KITCHEN_TABLE_NAME: backend.data.resources.tables["Kitchen"].tableName,
        HOUSEHOLD_RECIPES_TABLE_NAME: backend.data.resources.tables["HouseholdRecipes"].tableName,
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
    ]
}));

backend.createHouseholdFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
    actions: ["cognito-idp:CreateGroup", "cognito-idp:AdminAddUserToGroup"],
    resources: [
        backend.auth.resources.userPool.userPoolArn
    ]
}));

backend.inviteFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
    actions: ["dynamodb:GetItem"],
    resources: [backend.data.resources.tables["Household"].tableArn]
}));
backend.inviteFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
    actions: ["dynamodb:GetItem", "dynamodb:PutItem"],
    resources: [backend.data.resources.tables["HouseholdInvite"].tableArn]
}));

backend.joinFunction.resources.cfnResources.cfnFunction.environment = {
    variables: {
        HOUSEHOLD_TABLE_NAME: backend.data.resources.tables["Household"].tableName,
        HOUSEHOLD_INVITE_TABLE_NAME: backend.data.resources.tables["HouseholdInvite"].tableName,
    }
}

backend.joinFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
    actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
    resources: [backend.data.resources.tables["Household"].tableArn]
}));
backend.joinFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
    actions: ["dynamodb:GetItem", "dynamodb:DeleteItem"],
    resources: [backend.data.resources.tables["HouseholdInvite"].tableArn]
}));

cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());