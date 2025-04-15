import {defineBackend} from '@aws-amplify/backend';
import * as iam from "aws-cdk-lib/aws-iam";
import {auth} from './auth/resource';
import {data} from './data/resource';
import {inviteFunction, joinFunction, authFunction} from "./functions/resource";
import {cognitoUserPoolsTokenProvider} from 'aws-amplify/auth/cognito';
import {CookieStorage} from 'aws-amplify/utils';

const backend = defineBackend({
    inviteFunction,
    joinFunction,
    authFunction,
    auth,
    data,
});

backend.inviteFunction.resources.cfnResources.cfnFunction.environment = {
    variables: {
        HOUSEHOLD_TABLE_NAME: backend.data.resources.tables["Household"].tableName,
        HOUSEHOLD_INVITE_TABLE_NAME: backend.data.resources.tables["HouseholdInvite"].tableName,
    }
}

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