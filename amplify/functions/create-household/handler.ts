import {AppSyncResolverEvent, AppSyncIdentityCognito} from 'aws-lambda';
import {DynamoDB, CognitoIdentityServiceProvider} from 'aws-sdk';
import crypto from 'crypto';

const dynamoDb = new DynamoDB.DocumentClient();
const cognito = new CognitoIdentityServiceProvider();

export const handler = async (event: AppSyncResolverEvent<any>) => {
    const {name} = event.arguments;
    const userId:string = (event.identity as AppSyncIdentityCognito)?.sub;
    const userPoolId = process.env.COGNITO_USER_POOL_ID;

    const householdId = crypto.randomUUID();
    const adminGroup = [`admin:${householdId}`];
    const membersGroup = [`members:${householdId}`];

    const household = {
        id: householdId,
        name,
        adminGroup,
        membersGroup,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const todoListId = crypto.randomUUID();
    const householdTasksId = crypto.randomUUID();
    const todoList = {
        id: todoListId,
        name: "Todo",
        adminGroup,
        membersGroup,
        householdTasksId,
        unremovable: true,
        taskItems: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    // FIXME: This is error-prone doing it manually, need a way that makes use of AppSync's automatic handling that is also
    // atomic.
    const householdTasks = {
        id: householdTasksId,
        householdId,
        adminGroup,
        membersGroup,
        taskLists: [
            todoListId
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const kitchenId = crypto.randomUUID();
    const kitchen = {
        id: kitchenId,
        householdId,
        groceries: null,
        pantry: null,
        adminGroup,
        membersGroup,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const householdRecipesId = crypto.randomUUID();
    const householdRecipes = {
        id: householdRecipesId,
        householdId,
        recipes: [],
        adminGroup,
        membersGroup,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Perform all operations in a transaction
    await dynamoDb.transactWrite({
        TransactItems: [
            {
                Put: {
                    TableName: process.env.HOUSEHOLD_TABLE_NAME!,
                    Item: household,
                },
            },
            {
                Put: {
                    TableName: process.env.HOUSEHOLD_TASKS_TABLE_NAME!,
                    Item: householdTasks,
                },
            },
            {
                Put: {
                    TableName: process.env.KITCHEN_TABLE_NAME!,
                    Item: kitchen,
                },
            },
            {
                Put: {
                    TableName: process.env.HOUSEHOLD_RECIPES_TABLE_NAME!,
                    Item: householdRecipes,
                },
            },
            {
                Put: {
                    TableName: process.env.TASK_LIST_TABLENAME!,
                    Item: todoList,
                }
            }
        ],
    }).promise();

    await cognito.createGroup({
        GroupName: adminGroup[0],
        UserPoolId: userPoolId!,
    }).promise();

    await cognito.createGroup({
        GroupName: membersGroup[0],
        UserPoolId: userPoolId!,
    }).promise();

    await cognito.adminAddUserToGroup({
        UserPoolId: userPoolId!,
        Username: userId!,
        GroupName: adminGroup[0],
    }).promise();

    await cognito.addCustomAttributes()

    return household;
};