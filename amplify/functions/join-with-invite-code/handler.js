import AWS from "aws-sdk";
import JWT from 'jsonwebtoken';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event, context) => {
    const { inviteCode, joinerId } = event.arguments;

    if (!inviteCode) {
        throw "Missing inviteCode argument";
    }

    if(typeof inviteCode !== "string") {
        throw "inviteCode must be a string";
    }

    if (!joinerId) {
        throw "Missing joinerId argument";
    }

    const userId = decodeAuthHeader(event.request.headers?.authorization);

    if (joinerId !== userId) {
        throw "User ID argument does not match authenticated user";
    }

    console.log("Fetching invitation...");

    const invite = await dynamoDb.query({
        TableName: process.env.HOUSEHOLD_INVITE_TABLE_NAME,
        KeyConditionExpression: "inviteCode = :inviteCode",
        ExpressionAttributeValues: {
            ":inviteCode": inviteCode
        }
    }).promise();

    console.log(invite);

    if (invite.Count === 0) {
        throw "Invite not found";
    }

    console.log("Fetching household associated with invite...");
    const household = await dynamoDb.get({
        TableName: process.env.HOUSEHOLD_TABLE_NAME,
        Key: { id: invite.Items[0].householdId }
    }).promise();

    if (!household.Item) {
        throw "Household not found";
    }

    const memberGroup = household.Item.membersGroup;

    console.log("Adding user to Cognito group...");
    await cognitoIdentityServiceProvider.adminAddUserToGroup({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: userId,
        GroupName: memberGroup[0]
    }).promise();

    console.log("Deleting invite...");
    await dynamoDb.delete({
        TableName: process.env.HOUSEHOLD_INVITE_TABLE_NAME,
        Key: {
            inviteCode
        }
    }).promise();

    return `User ${userId} added to group ${memberGroup}`;
};

function decodeAuthHeader(header) {
    const decoded = JWT.decode(header);
    if (decoded.sub) {
        return decoded.sub;
    } else {
        throw "No user ID found in token";
    }
}