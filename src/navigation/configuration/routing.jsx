import {createBrowserRouter, redirect} from "react-router-dom";
import Layout from "../../layout/components/Layout";
import KitchenView from "../../kitchen/kitchen/components/KitchenView";
import PantryView from "../../kitchen/pantry/components/PantryView";
import RecipesView from "../../kitchen/recipes/components/RecipesView";
import GroceryView from "../../kitchen/groceries/components/GroceryView";
import React from "react";
import TasksView from "../../tasks/components/TasksView";
import SettingsView from "../../settings/components/SettingsView";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: (<Layout/>),
            children: [
                {
                    index: true,
                    loader: async () => redirect("/tasks")
                },
                {
                    path: "/tasks",
                    element: <TasksView/>,
                    children: [
                        {
                            index: true,
                            loader: async () => redirect("/tasks/todo")
                        },
                        {
                            path: ":id",
                            element: <TasksView/>,
                            children: [
                                {
                                    path: "task/:taskId",
                                }
                            ]
                        }
                    ]
                },
                {
                    path: "/kitchen",
                    element: <KitchenView/>,
                    children: [
                        {
                            index: true,
                            loader: async () => redirect("/kitchen/pantry")
                        },
                        {
                            path: "/kitchen/pantry",
                            element: <PantryView/>
                        },
                        {
                            path: "/kitchen/recipes",
                            element: <RecipesView/>
                        },
                        {
                            path: "/kitchen/grocery",
                            element: <GroceryView/>
                        }
                    ]
                },
                {
                    path: "/settings",
                    element: <SettingsView/>
                },
                {
                    path: "/sign-in",
                }
            ]
        }
    ]);
