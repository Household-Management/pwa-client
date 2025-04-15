import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import {authorizationConfiguration} from "../../data/resource.js"

export const handler = async (event) => {
    const {requestContext} = event;
    const authToken = jwt.decode(event.authorizationToken);
    const userId = authToken.claims.sub;
    const householdId = requestContext.variables.householdId;

    console.log(`User ID: ${userId}`, `Household ID: ${householdId}`);
    // Query the Household table
    const params = {
        TableName: process.env.HOUSEHOLD_TABLE_NAME, // Ensure this environment variable is set
        Key: {id: householdId},
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
        console.log("Household not found");
        return {
            isAuthorized: false,
            resolverContext: {}
        };
    }

    const household = result.Item;

    // Check if the user is in membersGroup or adminGroup
    const isMember = household.membersGroup.includes(userId);
    const isAdmin = household.adminGroup.includes(userId);

    console.log("User is member:", isMember, "User is admin:", isAdmin);

    const operationConfiguration = authorizationConfiguration[requestContext.operationName];

    if(!operationConfiguration) {
        console.log("Operation configuration not found");
        return {
            isAuthorized: false,
            resolverContext: {}
        }
    }

    console.log(`User ${userId} authorization for ${requestContext.operationName} as member: ${isMember && operationConfiguration.groups.contains("members")}`);
    console.log(`User ${userId} authorization for ${requestContext.operationName} as admin: ${isAdmin && operationConfiguration.groups.contains("admins")}`);

    return {
        isAuthorized: (operationConfiguration.groups.contains("members") && isMember) || (operationConfiguration.groups.contains("admins") && isAdmin),
        resolverContext: {}
    }
};