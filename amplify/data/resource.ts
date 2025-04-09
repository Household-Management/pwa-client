import {type ClientSchema, a, defineData, defineFunction} from '@aws-amplify/backend';
import {inviteFunction, joinFunction} from "../functions/resource";

function defaultOperations(allow: any): any[] {
    return [
        allow.ownersDefinedIn("membersGroup").to(["read"]),
        allow.ownersDefinedIn("adminGroup").to(["read", "update", "create", "delete"]),
    ]
}

function ownedModel(modelDef) {
    return {
        ...modelDef,
        membersGroup: a.string().array().required(), // Name for group members of the household
        adminGroup: a.string().array().required(), // Name for admins of the household
    }
}

const tasksModels = {
    HouseholdTasks: a.model(ownedModel({
        id: a.id().required(),
        taskLists: a.hasMany("TaskList", "householdTasksId"),
        householdId: a.id(),
        household: a.belongsTo("Household", "householdId"),
    })),
    TaskList: a.model(ownedModel({
        id: a.id().required(),
        name: a.string(),
        householdTasksId: a.id().required(),
        householdTasks: a.belongsTo("HouseholdTasks", "householdTasksId"),
        taskItems: a.hasMany("Task", "taskListId"),
        unremovable: a.boolean()
    })),
    Task: a.model(ownedModel({
        id: a.id().required(),
        title: a.string(),
        scheduledTime: a.string(),
        repeats: a.string().required(),
        description: a.string(),
        taskListId: a.id(),
        list: a.belongsTo("TaskList", "taskListId"),
    })),}

const kitchenModels = {
    Kitchen: a.model(ownedModel({
        id: a.id().required(),
        groceries: a.hasOne("Groceries", "kitchenId"),
        pantry: a.hasOne("Pantry", "kitchenId"),
        householdId: a.id(),
        household: a.belongsTo("Household", "householdId"),
    })),
    Groceries: a.model(ownedModel({
        id: a.id().required(),
        lists: a.hasMany("GroceryList", "groceriesId"),
        kitchenId: a.id(),
        kitchen: a.belongsTo("Kitchen", "kitchenId"),
    })),
    GroceryList: a.model(ownedModel({
        id: a.id().required(),
        items: a.hasMany("GroceryItem", "groceryListId"),
        groceriesId: a.id(),
        groceries: a.belongsTo("Groceries", "groceriesId"),
    })),
    GroceryItem: a.model(ownedModel({
        id: a.id().required(),
        name: a.string(),
        quantity: a.integer(),
        unit: a.string(),
        groceryListId: a.id(),
        list: a.belongsTo("GroceryList", "groceryListId"),
    })),
    Pantry: a.model(ownedModel({
        id: a.id().required(),
        locations: a.string().array(),
        items: a.hasMany("PantryItem", "pantryId"),
        kitchenId: a.id(),
        kitchen: a.belongsTo("Kitchen", "kitchenId"),
    })),
    PantryItem: a.model(ownedModel({
        id: a.id().required(),
        name: a.string(),
        quantity: a.integer(),
        location: a.string(),
        expiration: a.date(),
        pantryId: a.id(),
        pantry: a.belongsTo("Pantry", "pantryId"),
    })),
}

const recipeModels = {
    HouseholdRecipes: a.model(ownedModel({
        id: a.id().required(),
        recipes: a.hasMany("Recipe", "householdRecipesId"),
        householdId: a.id(),
        household: a.belongsTo("Household", "householdId"),
    })),
    Recipe: a.model(ownedModel({
        id: a.id().required(),
        title: a.string(),
        description: a.string(),
        ingredients: a.hasMany("RecipeIngredient", "recipeId"),
        instructions: a.string().array(),
        householdRecipesId: a.id(),
        belongsTo: a.belongsTo("HouseholdRecipes", "householdRecipesId"),
    })),
    RecipeIngredient: a.model(ownedModel({
        id: a.id().required(),
        recipeId: a.id(),
        recipe: a.belongsTo("Recipe", "recipeId"),
        ingredientId: a.id(),
        ingredient: a.belongsTo("Ingredient", "ingredientId"),
        quantity: a.integer(),
        unit: a.string()
    })),
    Ingredient: a.model(ownedModel({
        id: a.id().required(),
        name: a.string(),
        recipes: a.hasMany("RecipeIngredient", "ingredientId")
    })),
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
    }).authorization(allow => [
        allow.ownersDefinedIn("membersGroup").to(["read"]),
        allow.ownersDefinedIn("adminGroup").to(["read", "create"]),
    ]),
    InviteToHousehold: a.mutation().arguments({
        householdId: a.id().required()
    }).returns(a.string())
        .authorization(customAllow => [customAllow.authenticated("userPools")])
        .handler(a.handler.function(inviteFunction)),
    JoinHousehold: a.mutation().arguments({
        inviteCode: a.string().required(),
        joinerId: a.id().required()
    }).authorization(customAllow => [customAllow.authenticated("userPools")])
        .handler(a.handler.function(joinFunction))
        .returns(a.id()),
    // TODO: Rate limit for code generation, 1 / 5 minutes
    // FIXME: Make sure that duplicate invites can't be created
    HouseholdInvite: a.model({
        inviteCode: a.string().required(),
        householdId: a.id().required(),
        household: a.belongsTo("Household", "householdId"),
        expiration: a.datetime(),
    }).identifier(["inviteCode"]),
    ...tasksModels,
    ...kitchenModels,
    ...recipeModels
}).authorization(allow =>[
    //@ts-ignore,
    allow.resource(inviteFunction)
].concat(defaultOperations(allow)));

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool',
    },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>import {type ClientSchema, a, defineData, defineFunction} from '@aws-amplify/backend';
// import {inviteFunction, joinFunction} from "../functions/resource";
// // @ts-ignore
// import { BaseAllowModifier, Authorization } from "@aws-amplify/data-schema/dist/esm/Authorization";
//
// function defaultOperations(allow: any): any[] {
//     return [
//         allow.ownersDefinedIn("owners").to(["read", "update", "create"]),
//     ]
// }
//
// function ownedModel(modelDef) {
//     return {
//         ...modelDef,
//         membersGroup: a.string().array(), // Name for group members of the household
//         adminGroup: a.string().array(), // Name for admins of the household
//     }
// }
//
// const tasksModels = {
//     HouseholdTasks: ownedModel(a.model({
//         id: a.id().required(),
//         taskLists: a.hasMany("TaskList", "householdTasksId"),
//         householdId: a.id(),
//         household: a.belongsTo("Household", "householdId"),
//     })),
//     TaskList: ownedModel(a.model({
//         id: a.id().required(),
//         name: a.string(),
//         householdTasksId: a.id().required(),
//         householdTasks: a.belongsTo("HouseholdTasks", "householdTasksId"),
//         taskItems: a.hasMany("Task", "taskListId"),
//         unremovable: a.boolean()
//     })),
//     // FIXME: Validate that parent task list exists.
//     Task: ownedModel(a.model({
//         id: a.id().required(),
//         title: a.string(),
//         scheduledTime: a.string(),
//         repeats: a.hasOne("TaskRepeat", "owningTaskId"),
//         description: a.string(),
//         taskListId: a.id(),
//         list: a.belongsTo("TaskList", "taskListId"),
//     })),
//     TaskRepeat: ownedModel(a.model({
//         id: a.id().required(),
//         repeatType: a.string(),
//         repeatOn: a.boolean().array(),
//         owningTaskId: a.id(),
//         task: a.belongsTo("Task", "owningTaskId"),
//     })),
// }
//
// const kitchenModels = {
//     Kitchen: ownedModel(a.model({
//         id: a.id().required(),
//         groceries: a.hasOne("Groceries", "kitchenId"),
//         pantry: a.hasOne("Pantry", "kitchenId"),
//         householdId: a.id(),
//         household: a.belongsTo("Household", "householdId"),
//     })),
//     Groceries: ownedModel(a.model({
//         id: a.id().required(),
//         lists: a.hasMany("GroceryList", "groceriesId"),
//         kitchenId: a.id(),
//         kitchen: a.belongsTo("Kitchen", "kitchenId"),
//     })),
//     GroceryList: ownedModel(a.model({
//         id: a.id().required(),
//         items: a.hasMany("GroceryItem", "groceryListId"),
//         groceriesId: a.id(),
//         groceries: a.belongsTo("Groceries", "groceriesId"),
//     })),
//     GroceryItem: ownedModel(a.model({
//         id: a.id().required(),
//         name: a.string(),
//         quantity: a.integer(),
//         unit: a.string(),
//         groceryListId: a.id(),
//         list: a.belongsTo("GroceryList", "groceryListId"),
//     })),
//     Pantry: ownedModel(a.model({
//         id: a.id().required(),
//         locations: a.string().array(),
//         items: a.hasMany("PantryItem", "pantryId"),
//         kitchenId: a.id(),
//         kitchen: a.belongsTo("Kitchen", "kitchenId"),
//     })),
//     PantryItem: ownedModel(a.model({
//         id: a.id().required(),
//         name: a.string(),
//         quantity: a.integer(),
//         location: a.string(),
//         expiration: a.date(),
//         pantryId: a.id(),
//         pantry: a.belongsTo("Pantry", "pantryId"),
//     })),
// }
//
// const recipeModels = {
//     HouseholdRecipes: ownedModel(a.model({
//         id: a.id().required(),
//         recipes: a.hasMany("Recipe", "householdRecipesId"),
//         householdId: a.id(),
//         household: a.belongsTo("Household", "householdId"),
//     })),
//     Recipe: ownedModel(a.model({
//         id: a.id().required(),
//         title: a.string(),
//         description: a.string(),
//         ingredients: a.hasMany("RecipeIngredient", "recipeId"),
//         instructions: a.string().array(),
//         householdRecipesId: a.id(),
//         belongsTo: a.belongsTo("HouseholdRecipes", "householdRecipesId"),
//     })),
//     RecipeIngredient: ownedModel(a.model({
//         id: a.id().required(),
//         recipeId: a.id(),
//         recipe: a.belongsTo("Recipe", "recipeId"),
//         ingredientId: a.id(),
//         ingredient: a.belongsTo("Ingredient", "ingredientId"),
//         quantity: a.integer(),
//         unit: a.string()
//     })),
//     Ingredient: ownedModel(a.model({
//         id: a.id().required(),
//         name: a.string(),
//         recipes: a.hasMany("RecipeIngredient", "ingredientId")
//     })),
// }
//
// // TODO: Don't want client to be able to create new households, have a backend
// //  function for it that checks if a user already has one. Then make read-only stuff truly read only.
// const schema = a.schema({
//     Household: ownedModel(a.model({
//         id: a.id().required(),
//         name: a.string().required(),
//         kitchen: a.hasOne("Kitchen", "householdId"),
//         householdTasks: a.hasOne("HouseholdTasks", "householdId"),
//         recipes: a.hasOne("HouseholdRecipes", "householdId"),
//         pendingInvites: a.hasMany("HouseholdInvite", "householdId"),
//     })).authorization(allow => [
//         allow.ownersDefinedIn("membersGroup").to(["read"])
//     ]),
//     // TODO URGENT: Need to implement authorization for this to be allowed
//     InviteToHousehold: a.mutation().arguments({
//         householdId: a.id().required()
//     }).returns(a.string())
//         .authorization(customAllow => [customAllow.authenticated("userPools")])
//         .handler(a.handler.function(inviteFunction)),
//     JoinHousehold: a.mutation().arguments({
//         inviteCode: a.string().required(),
//         joinerId: a.id().required()
//     }).authorization(customAllow => [customAllow.authenticated("userPools")])
//         .handler(a.handler.function(joinFunction))
//         .returns(a.id()),
//     // TODO: Rate limit for code generation, 1 / 5 minutes
//     // FIXME: Make sure that duplicate invites can't be created
//     HouseholdInvite: ownedModel(a.model({
//         inviteCode: a.string().required(),
//         householdId: a.id().required(),
//         household: a.belongsTo("Household", "householdId"),
//         expiration: a.datetime(),
//     })).identifier(["inviteCode"]),
//     ...tasksModels,
//     ...kitchenModels,
//     ...recipeModels
// }).authorization(allow =>[
//     //@ts-ignore,
//     allow.resource(inviteFunction)
// ].concat(defaultOperations(allow)));
//
// export type Schema = ClientSchema<typeof schema>;
//
// export const data = defineData({
//     schema,
//     authorizationModes: {
//         defaultAuthorizationMode: 'userPool',
//     },
// });
//
// /*== STEP 2 ===============================================================
// Go to your frontend source code. From your client-side code, generate a
// Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
// WORK IN THE FRONTEND CODE FILE.)
//
// Using JavaScript or Next.js React Server Components, Middleware, Server
// Actions or Pages Router? Review how to generate Data clients for those use
// cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
// =========================================================================*/
//
// /*
// "use client"
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource";
//
// const client = generateClient<Schema>() // use this Data client for CRUDL requests
// */
//
// /*== STEP 3 ===============================================================
// Fetch records from the database and use them in your frontend component.
// (THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
// =========================================================================*/
//
// /* For example, in a React component, you can use this snippet in your
//   function's RETURN statement */
// // const { data: todos } = await client.models.Todo.list()
//
// // return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>