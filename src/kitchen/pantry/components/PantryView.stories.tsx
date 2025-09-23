import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import PantryView from "../components/PantryView";

export default {
    title: "Kitchen/PantryView",
    component: PantryView,
};

const mockStore = configureStore({
    reducer: {
        household: (state = {
            kitchen: {
                pantry: {
                    id: "mock-pantry-id",
                    items: [
                        {
                            item: {
                                id: "1",
                                name: "Milk",
                                nutrition: {
                                    calories: 150,
                                    protein: 8,
                                    fat: 5,
                                    carbohydrates: 12,
                                },
                            },
                            state: {
                                pantryId: "mock-pantry-id",
                                location: "Fridge",
                                expiration: "2023-12-01",
                                quantity: 1,
                                units: "liters",
                            },
                        },
                        {
                            item: {
                                id: "2",
                                name: "Bread",
                                nutrition: {
                                    calories: 80,
                                    protein: 3,
                                    fat: 1,
                                    carbohydrates: 15,
                                },
                            },
                            state: {
                                pantryId: "mock-pantry-id",
                                location: "Pantry",
                                expiration: "2023-11-25",
                                quantity: 2,
                                units: "loaves",
                            },
                        },
                    ],
                    locations: ["Pantry", "Fridge", "Freezer"],
                },
            },
        }) => state,
    },
    preloadedState: {},
});

export const Default = () => (
    <Provider store={mockStore}>
        <PantryView />
        </Provider>
);