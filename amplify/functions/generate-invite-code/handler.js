import AWS from "aws-sdk";
import JWT from 'jsonwebtoken';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

function generateInviteCode() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export const handler = async (event, context) => {
    const {householdId} = event.arguments;
    const userId = decodeAuthHeader(event.request.headers?.authorization);

    console.log(`Getting household ${householdId} to generate code for...`);
    const household = await dynamoDb.get({
        TableName: process.env.HOUSEHOLD_TABLE_NAME,
        Key: {id: householdId}
    }).promise();

    // Check if the user is an admin
    if (household.Item.adminGroup.includes(userId)) {
        console.log("Generating invite code");
        // Generate invite code
        const inviteCode = generateInviteCode();

        // Save invite code to DynamoDB
        await dynamoDb.put({
            TableName: process.env.HOUSEHOLD_INVITE_TABLE_NAME,
            Item: {
                id: AWS.util.uuid.v4(),
                householdId,
                inviteCode,
                expiration: new Date(Date.now() + 10 * 60 * 1000).toISOString()
            }
        }).promise();

        // Return invite code
        return inviteCode;
    } else {
        return {
            statusCode: 403,
            body: JSON.stringify({message: `User does not have authorization to generate invites.`})
        };
    }
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