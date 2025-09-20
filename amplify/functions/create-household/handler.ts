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

    const todoListId = crypto.randomUUID();
    const householdTasksId = crypto.randomUUID();
    const kitchenId = crypto.randomUUID();
    const householdRecipesId = crypto.randomUUID();
    const pantryId = crypto.randomUUID();
    const groceriesId = crypto.randomUUID();

    const household = {
        id: householdId,
        name,
        adminGroup,
        membersGroup,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

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
    };

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

    const kitchen = {
        id: kitchenId,
        householdId,
        groceries: groceriesId,
        pantry: pantryId,
        adminGroup,
        membersGroup,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const householdRecipes = {
        id: householdRecipesId,
        householdId,
        recipes: [],
        adminGroup,
        membersGroup,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const pantry = {
        id: pantryId,
        kitchenId,
        items: [],
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
            },
            {
                Put: {
                    TableName: process.env.PANTRY_TABLE_NAME!,
                    Item: pantry
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