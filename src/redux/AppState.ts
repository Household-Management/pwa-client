import { PantryState } from "../kitchen/pantry/state/PantryStateConfiguration.ts";
import TaskStateConfiguration from "../tasks/state/TaskStateConfiguration";
import {TutorialStateConfiguration} from "../tutorials/state/TutorialStateConfiguration";
import AlertsStateConfiguration from "../alerts/configuration/AlertsStateConfiguration";
import GroceriesStateConfiguration from "../kitchen/groceries/state/GroceriesStateConfiguration";
import {RecipesState} from "../kitchen/recipes/state/RecipesStateConfiguration";

type AppState = {
    household: {
        name: string | null,
        id: string | null,
        adminGroup: string[] | null,
        membersGroup: string[] | null,
        householdTasks: TaskStateConfiguration.State,
        tutorials: TutorialStateConfiguration.State,
        kitchen: {
            pantry: PantryState,
            groceries: GroceriesStateConfiguration.State,
            recipes: RecipesState
        }
    },
    alerts: AlertsStateConfiguration.State,
    user: {
        loginId: string | null,
        user: any | null,
        welcomed: boolean
    } | null
}

export default AppState;