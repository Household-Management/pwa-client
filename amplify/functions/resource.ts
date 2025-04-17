import {defineFunction} from "@aws-amplify/backend";
import * as iam from "aws-cdk-lib/aws-iam";

export const inviteFunction = defineFunction({
    name: "InviteToHousehold",
    entry: "./generate-invite-code/handler.js",
    resourceGroupName: "data"
});
//@ts-ignore
inviteFunction.configure = backend => {
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

    backend.inviteFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [backend.data.resources.tables["Household"].tableArn]
    }));

    backend.inviteFunction.resources.lambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:PutItem"],
        resources: [backend.data.resources.tables["HouseholdInvite"].tableArn]
    }));
}

export const joinFunction = defineFunction({
    name: "JoinHousehold",
    entry: "./join-with-invite-code/handler.js",
    resourceGroupName: "data"
});
//@ts-ignore
joinFunction.configure = backend => {
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
}

export const createHouseholdFunction = defineFunction({
    name: "CreateHousehold",
    entry: "./create-household/handler.ts",
    resourceGroupName: "data"
});
//@ts-ignore
createHouseholdFunction.configure = backend => {
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