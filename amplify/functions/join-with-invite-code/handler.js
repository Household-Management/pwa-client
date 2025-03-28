import AWS from "aws-sdk";
import JWT from 'jsonwebtoken';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

function generateInviteCode() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
// TODO: Turn this into a custom resolver
export const handler = async (event, context) => {
    const { inviteCode, joinerId } = event.arguments;

    if (!inviteCode) {
        throw "Missing inviteCode argument";
    }

    if (!joinerId) {
        throw "Missing joinerId argument";
    }

    const userId = decodeAuthHeader(event.request.headers?.authorization);

    if (joinerId != userId) {
        throw "User ID argument does not match authenticated user";
    }

    console.log("Fetching invitation...");

    const invite = await dynamoDb.get({
        TableName: process.env.HOUSEHOLD_INVITE_TABLE_NAME,
        Key: {
            inviteCode
             }
    }).promise();

    console.log(invite);

    if(!invite.Item) {
        throw "Invite not found";
    }

    console.log("Fetching household associated with invite...");
    const household = await dynamoDb.get({
        TableName: process.env.HOUSEHOLD_TABLE_NAME,
        Key: {id: invite.Item.householdId}
    }).promise();

    household.Item.memberGroup.push(userId);

    console.log("Updating household with new member...");
    await dynamoDb.update({
        TableName: process.env.HOUSEHOLD_TABLE_NAME,
        Key: {id: household.Item.id},
        UpdateExpression: "SET memberGroup = :memberGroup",
        ExpressionAttributeValues: {
            ":memberGroup": household.Item.memberGroup
        }
    }).promise();

    console.log("Deleting invite...");
    await dynamoDb.delete({
        TableName: process.env.HOUSEHOLD_INVITE_TABLE_NAME,
        Key: {
            inviteCode
        }
    }).promise();

    return household.Item.id;
};

function decodeAuthHeader(header) {
    console.log(header);
    const decoded = JWT.decode(header);
    if (decoded.sub) {
        return decoded.sub;
    } else {
        throw "No user ID found in token";
    }
}