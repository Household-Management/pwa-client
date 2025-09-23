import {useState} from "react";
import NutritionInformation from "../components/NutritionInformation";
import {PantryItem} from "../state/PantryStateConfiguration";
import NutritionInformationDialog from "./NutritionInformationDialog";
import {VIEW_NUTRITION_DIALOG} from "./PantryView.tsx";

export default {
    title: "Kitchen/NutritionInformation",
    component: NutritionInformation,
};

export const Default = ({model}) => {
    const [item, setItem] = useState<PantryItem | undefined>(model);

    return <NutritionInformation value={item as PantryItem} setItem={setItem}/>;
};

Default.args = {
    model: {
        item: {
            name: "Sample Item",
            nutrition: {
                servingSize: "1 cup",
                calories: 200,
                protein: 10,
                fat: 5,
                carbohydrates: 30,
                fiber: 5,
                sugar: 10,
                sodium: 150,
            },
        },
        state: {
            expiration: "2023-12-31",
            location: "Pantry",
            quantity: 1,
            units: "units",
        },
    }
}

export const InDialog = ({model}) => {
    const [_openDialog, setOpenDialog] = useState<string | null>(null);
    const [item] = useState<PantryItem | undefined>(model);

    return <NutritionInformationDialog openDialog={VIEW_NUTRITION_DIALOG} setOpenDialog={setOpenDialog} targetItem={item}/>;
}

InDialog.args = {
    model: {
        item: {
            name: "Sample Item",
            nutrition: {
                servingSize: "1 cup",
                calories: 200,
                protein: 10,
                fat: 5,
                carbohydrates: 30,
                fiber: 5,
                sugar: 10,
                sodium: 150,
            },
        },
        state: {
            expiration: "2023-12-31",
            location: "Pantry",
            quantity: 1,
            units: "units",
        },
    }
}