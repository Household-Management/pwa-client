import {type ClientSchema, a, defineData, defineFunction} from '@aws-amplify/backend';
import {inviteFunction, joinFunction, authFunction} from "../functions/resource";

function readOnly(allow) {
    return [
        allow.groups(["members", "admin"]).to(["read"]),
    ]
}

function standardOperations(allow) {
    return [
        allow.group("members").to(["read"]),
        allow.group("admin").to(["read", "create", "update"]),
        allow.custom(),
    ]
}

const tasksModels = {
    HouseholdTasks: a.model({
        id: a.id().required(),
        taskLists: a.hasMany("TaskList", "householdTasksId"),
        householdId: a.id(),
        household: a.belongsTo("Household", "householdId"),
    }).authorization(standardOperations),
    TaskList: a.model({
        id: a.id().required(),
        name: a.string(),
        householdTasksId: a.id().required(),
        householdTasks: a.belongsTo("HouseholdTasks", "householdTasksId"),
        taskItems: a.hasMany("Task", "taskListId"),
        unremovable: a.boolean()
    }).authorization(standardOperations),
    Task: a.model({
        id: a.id().required(),
        title: a.string(),
        scheduledTime: a.string(),
        repeats: a.string().required(),
        description: a.string(),
        taskListId: a.id(),
        list: a.belongsTo("TaskList", "taskListId"),
    }).authorization(standardOperations),
}

const kitchenModels = {
    Kitchen: a.model({
        id: a.id().required(),
        groceries: a.hasOne("Groceries", "kitchenId"),
        pantry: a.hasOne("Pantry", "kitchenId"),
        householdId: a.id(),
        household: a.belongsTo("Household", "householdId"),
    }).authorization(standardOperations),
    Groceries: a.model({
        id: a.id().required(),
        lists: a.hasMany("GroceryList", "groceriesId"),
        kitchenId: a.id(),
        kitchen: a.belongsTo("Kitchen", "kitchenId"),
    }).authorization(standardOperations),
    GroceryList: a.model({
        id: a.id().required(),
        items: a.hasMany("GroceryItem", "groceryListId"),
        groceriesId: a.id(),
        groceries: a.belongsTo("Groceries", "groceriesId"),
    }).authorization(standardOperations),
    GroceryItem: a.model({
        id: a.id().required(),
        name: a.string(),
        quantity: a.integer(),
        unit: a.string(),
        groceryListId: a.id(),
        list: a.belongsTo("GroceryList", "groceryListId"),
    }).authorization(standardOperations),
    Pantry: a.model({
        id: a.id().required(),
        locations: a.string().array(),
        items: a.hasMany("PantryItem", "pantryId"),
        kitchenId: a.id(),
        kitchen: a.belongsTo("Kitchen", "kitchenId"),
    }).authorization(standardOperations),
    PantryItem: a.model({
        id: a.id().required(),
        name: a.string(),
        quantity: a.integer(),
        location: a.string(),
        expiration: a.date(),
        pantryId: a.id(),
        pantry: a.belongsTo("Pantry", "pantryId"),
    }).authorization(standardOperations),
}

const recipeModels = {
    HouseholdRecipes: a.model({
        id: a.id().required(),
        recipes: a.hasMany("Recipe", "householdRecipesId"),
        householdId: a.id(),
        household: a.belongsTo("Household", "householdId"),
    }).authorization(standardOperations),
    Recipe: a.model({
        id: a.id().required(),
        title: a.string(),
        description: a.string(),
        ingredients: a.hasMany("RecipeIngredient", "recipeId"),
        instructions: a.string().array(),
        householdRecipesId: a.id(),
        belongsTo: a.belongsTo("HouseholdRecipes", "householdRecipesId"),
    }).authorization(standardOperations),
    RecipeIngredient: a.model({
        id: a.id().required(),
        recipeId: a.id(),
        recipe: a.belongsTo("Recipe", "recipeId"),
        ingredientId: a.id(),
        ingredient: a.belongsTo("Ingredient", "ingredientId"),
        quantity: a.integer(),
        unit: a.string()
    }).authorization(standardOperations),
    Ingredient: a.model({
        id: a.id().required(),
        name: a.string(),
        recipes: a.hasMany("RecipeIngredient", "ingredientId")
    }).authorization(standardOperations),
}

const schema = a.schema({
    Household: a.model({
        id: a.id().required(),
        name: a.string().required(),
        kitchen: a.hasOne("Kitchen", "householdId"),
        householdTasks: a.hasOne("HouseholdTasks", "householdId"),
        recipes: a.hasOne("HouseholdRecipes", "householdId"),
        pendingInvites: a.hasMany("HouseholdInvite", "householdId"),
        membersGroup: a.string().array().required(), // Name for group members of the household
        adminGroup: a.string().array().required(), // Name for admins of the household
    }).authorization(standardOperations),
    InviteToHousehold: a.mutation().arguments({
        householdId: a.id().required()
    }).returns(a.string())
        .authorization(customAllow => [
            customAllow.group("admin")
                ])
        .handler(a.handler.function(inviteFunction)),
    JoinHousehold: a.mutation().arguments({
        inviteCode: a.string().required(),
        joinerId: a.id().required()
    }).authorization(customAllow => [
        customAllow.group("admin")])
        .handler(a.handler.function(joinFunction))
        .returns(a.id()),
    // TODO: Rate limit for code generation, 1 / 5 minutes
    // FIXME: Make sure that duplicate invites can't be created
    HouseholdInvite: a.model({
        inviteCode: a.string().required(),
        householdId: a.id().required(),
        household: a.belongsTo("Household", "householdId"),
        expiration: a.datetime(),
    }).identifier(["inviteCode"])
        .authorization(allow => [
            allow.group("admin").to(["read", "create", "update"])
        ]),
    ...tasksModels,
    ...kitchenModels,
    ...recipeModels
}).authorization(allow =>[
    //@ts-ignore,
    allow.resource(inviteFunction),
    allow.custom()
]);

export type Schema = ClientSchema<typeof schema>;

// TODO: Create an object to contain a mapping between the groups and operations that are allowed.
// They will need to be generated, but the pattern should be straightforward to implement.
// https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/

// console.log(Object.keys(schema.models.Household.data.fields));
// console.log(schema.models.Household.data.authorization[0][Object.getOwnPropertySymbols(schema.models.Household.data.authorization[0])[0]])

export const authorizationConfiguration = Object.keys(schema.models).reduce((operations, modelName) => {
    // const modelFields = Object.keys(schema.models[modelName].data.fields);
    for(let authorization of schema.models[modelName].data.authorization) {

        const symbols = Object.getOwnPropertySymbols(authorization);

        const authData = authorization[symbols[0]]

        switch (authData.strategy) {
            case "groups":
                for(let operation in authData.operations) {
                    const operationName = authData.operations[operation];
                    if (operationName === "read") {
                        if(operations[`list${modelName}`] === undefined) {
                            operations[`list${modelName}`] = {
                                groups: authData.groups
                            };
                        } else {
                            operations[`list${modelName}`].groups = [...new Set([...operations[`list${modelName}`].groups, ...authData.groups])];
                        }

                        if(operations[`get${modelName}`] === undefined) {
                            operations[`get${modelName}`] = {
                                groups: authData.groups
                            };
                        } else {
                            operations[`get${modelName}`].groups = [...new Set([...operations[`get${modelName}`].groups, ...authData.groups])];
                        }
                    } else {
                        if(operations[`${operationName}${modelName}`] === undefined) {
                            operations[`${operationName}${modelName}`] = {
                                groups: authData.groups
                            };
                        } else {
                            operations[`${operationName}${modelName}`].groups = [...new Set([...operations[`${operationName}${modelName}`].groups, ...authData.groups])];
                        }
                    }
                }
                break;
            default:
                console.warn("Not supported: " + authData.strategy, "Custom lambda configuration will not be generated.");
        }
    }
    return operations
}, {});

export const data = defineData({
    schema,
    authorizationModes: {
        lambdaAuthorizationMode: {
            function: authFunction,
            timeToLiveInSeconds: 60
        },
        defaultAuthorizationMode: 'lambda',
    },
    logging : {
        excludeVerboseContent: false,
        retention: "1 day",
        fieldLogLevel: "all",

    }
});