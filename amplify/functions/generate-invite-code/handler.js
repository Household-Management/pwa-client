import AWS from "aws-sdk";
import JWT from 'jsonwebtoken';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

function generateInviteCode() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export const handler = async (event, context) => {
    const {householdId} = event.arguments;
    const authToken = decodeAuthHeader(event.request.headers?.authorization);

    console.log(`Getting household ${householdId} to generate code for...`);
    const household = await dynamoDb.get({
        TableName: process.env.HOUSEHOLD_TABLE_NAME,
        Key: {id: householdId}
    }).promise();

    // Check if the user is an admin
    if (household.Item.adminGroup.filter(t => authToken['cognito:groups'].indexOf(t) !== -1).length > 0) {
        console.log("Checking unused invite codes");

        // Fetch existing invite codes for the household
        // TODO: Add an index on householdId to make this query efficient
        const existingCodes = await dynamoDb.query({
            TableName: process.env.HOUSEHOLD_INVITE_TABLE_NAME,
            IndexName: "householdInvitesByHouseholdId", // TODO: Find a way to avoid hardcoding
            KeyConditionExpression: "householdId = :householdId",
            ExpressionAttributeValues: {
                ":householdId": householdId
            }
        }).promise();

        const unusedCodes = existingCodes.Items.filter(code => new Date(code.expiration) > new Date());

        if (unusedCodes.length < 3) {
            console.log("Generating new invite code");
            const inviteCode = generateInviteCode();

            // Save new invite code to DynamoDB
            await dynamoDb.put({
                TableName: process.env.HOUSEHOLD_INVITE_TABLE_NAME,
                Item: {
                    id: AWS.util.uuid.v4(),
                    householdId,
                    inviteCode,
                    expiration: new Date(Date.now() + 10 * 60 * 1000).toISOString()
                }
            }).promise();

            unusedCodes.push({
                inviteCode,
                expiration: new Date(Date.now() + 10 * 60 * 1000).toISOString()
            });
        }

        // Return all unused invite codes
        return unusedCodes.map(_ => _.inviteCode);
    } else {
        throw new Error(`User does not have authorization to generate invites.`);
    }
};

function decodeAuthHeader(header) {
    console.log(header);
    const decoded = JWT.decode(header);
    if (decoded.sub) {
        return decoded;
    }
}