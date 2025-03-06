import {createBrowserRouter, redirect} from "react-router-dom";
import Layout from "../../layout/components/Layout";
import KitchenView from "../../kitchen/components/KitchenView";
import PantryView from "../../kitchen/components/PantryView";
import RecipesView from "../../kitchen/components/RecipesView";
import GroceryView from "../../kitchen/components/GroceryView";
import React from "react";
import {TasksView} from "../../tasks/components/TasksView";

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
                            path: "/tasks/:id",
                            element: <TasksView/>,
                        }
                    ]
                }, {
                    path: "/kitchen",
                    element: <KitchenView/>,
                    children: [
                        {
                            path: "pantry",
                            element: <PantryView/>
                        },
                        {
                            path: "recipes",
                            element: <RecipesView/>
                        },
                        {
                            path: "grocery",
                            element: <GroceryView/>
                        }
                    ]
                }]
        }
    ]);
