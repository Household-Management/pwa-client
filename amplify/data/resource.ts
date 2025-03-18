import {type ClientSchema, a, defineData} from '@aws-amplify/backend';
import {SchemaModelGenerator} from "../../src/tasks/model/Task"

const schema = a.schema({
    Household: a.model({
        id: a.id().required(),
        kitchen: a.hasOne("Kitchen", "id"),
        householdTasks: a.hasOne("HouseholdTasks", "id"),
        recipes: a.hasOne("HouseholdRecipes", "id"),
        members: a.string().array(),
    }),
    HouseholdTasks: a.model({
        id: a.id().required(),
        taskLists: a.hasMany("TaskList", "id"),
        household: a.belongsTo("Household", "id"),
    }),
    TaskList: a.model({
        id: a.id().required(),
        name: a.string(),
        taskItems: a.hasMany("Task", "id"),
        listTasks: a.belongsTo("HouseholdTasks", "id"),
    }),
    Task: a.model({
        id: a.id().required(),
        title: a.string(),
        scheduledTime: a.string(),
        repeats: a.hasOne("TaskRepeat", "id"),
        description: a.string(),
        list: a.belongsTo("TaskList", "id"),
    }),
    TaskRepeat: a.model({
        id: a.id().required(),
        repeatType: a.string(),
        repeatOn: a.boolean().array(),
        task: a.belongsTo("Task", "id"),
    }),
    Kitchen: a.model({
        id: a.id().required(),
        groceries: a.hasOne("Groceries", "id"),
        pantry: a.hasOne("Pantry", "id"),
        household: a.belongsTo("Household", "id"),
    }),
    Groceries: a.model({
        id: a.id().required(),
        lists: a.hasMany("GroceryList", "id"),
        kitchen: a.belongsTo("Kitchen", "id"),
    }),
    GroceryList: a.model({
        id: a.id().required(),
        items: a.hasMany("GroceryItem", "id"),
        groceries: a.belongsTo("Groceries", "id"),
    }),
    GroceryItem: a.model({
        id: a.id().required(),
        name: a.string(),
        quantity: a.integer(),
        unit: a.string(),
        list: a.belongsTo("GroceryList", "id"),
    }),
    Pantry: a.model({
        id: a.id().required(),
        locations: a.string().array(),
        items: a.hasMany("PantryItem", "id"),
        kitchen: a.belongsTo("Kitchen", "id"),
    }),
    PantryItem: a.model({
        id: a.id().required(),
        name: a.string(),
        quantity: a.integer(),
        location: a.string(),
        expiration: a.date(),
        pantry: a.belongsTo("Pantry", "id"),
    }),
    HouseholdRecipes: a.model({
        id: a.id().required(),
        recipes: a.hasMany("Recipe", "id"),
        household: a.belongsTo("Household", "id"),
    }),
    Recipe: a.model({
        id: a.id().required(),
        title: a.string(),
        description: a.string(),
        ingredients: a.hasMany("RecipeIngredient", "id"),
        instructions: a.string().array(),
        belongsTo: a.belongsTo("HouseholdRecipes", "id"),
    }),
    RecipeIngredient: a.model({
        id: a.id().required(),
        recipe: a.belongsTo("Recipe", "id"),
        ingredient: a.belongsTo("Ingredient", "id"),
        quantity: a.integer(),
        unit: a.string()
    }),
    Ingredient: a.model({
        id: a.id().required(),
        name: a.string(),
        recipes: a.hasMany("RecipeIngredient", "id")
    })
}).authorization(allow => allow.owner().to(["read", "create", "update"]));

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

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
