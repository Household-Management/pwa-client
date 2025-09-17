import {createBrowserRouter, Navigate, Outlet, redirect} from "react-router-dom";
import Layout from "../../layout/components/Layout";
import KitchenView from "../../kitchen/kitchen/components/KitchenView";
import PantryView from "../../kitchen/pantry/components/PantryView";
import RecipesView from "../../kitchen/recipes/components/RecipesView";
import GroceryView from "../../kitchen/groceries/components/GroceryView";
import React from "react";
import TasksView from "../../tasks/components/TasksView";
import SettingsView from "../../settings/components/SettingsView";
import HouseholdSelectorWrapper from "../components/HouseholdSelectorWrapper";
import Guarded from "../../authorization/Guarded";
import AppAuthenticator, {
    ResetPasswordPath,
    SignInPath,
    SignUpPath
} from "../../authentication/components/AppAuthenticator";

function secured(component, roles) {
    return <Guarded requiredRoles={roles} deniedComponent={<Navigate to={SignInPath}/>}>
        {component}
    </Guarded>
}

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: (<Layout>
                <Outlet/>
            </Layout>),
            children: [
                {
                    index: true,
                    loader: async () => redirect("/kitchen/pantry") // TODO: Configure default route, not hardcode.
                },
                {
                    path: "/tasks",
                    element: secured(<TasksView/>, ["members", "admin"]),
                    children: [
                        {
                            index: true,
                            loader: async () => redirect("/tasks/todo")
                        },
                        {
                            path: ":list",
                            element: secured(<TasksView/>, ["members", "admin"]),
                            children: [
                                {
                                    path: "task/:task",
                                }
                            ]
                        }
                    ]
                },
                {
                    path: "/kitchen",
                    element: secured(<KitchenView/>, ["members", "admin"]),
                    children: [
                        {
                            index: true,
                            loader: async () => redirect("/kitchen/pantry")
                        },
                        {
                            path: "/kitchen/pantry",
                            element: secured(<PantryView/>, ["members", "admin"]),
                        },
                        {
                            path: "/kitchen/recipes",
                            element: secured(<RecipesView/>, ["members", "admin"]),
                        },
                        {
                            path: "/kitchen/grocery",
                            element: secured(<GroceryView/>, ["members", "admin"]),
                        }
                    ]
                },
                {
                    path: "/settings",
                    element: secured(<SettingsView/>, ["members", "admin"]),
                },
                {
                    path: SignInPath,
                    element: <AppAuthenticator/>
                },
                {
                    path: SignUpPath,
                    element: <AppAuthenticator/>
                },
                {
                    path: ResetPasswordPath,
                    element: <AppAuthenticator/>
                },
                {
                    path: "/household-select",
                    element: secured(<HouseholdSelectorWrapper/>, ["*"]),
                }
            ]
        }
    ]);
