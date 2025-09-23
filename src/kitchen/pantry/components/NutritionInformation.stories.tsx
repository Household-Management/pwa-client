import {useState} from "react";
import NutritionInformation from "../components/NutritionInformation";
import {PantryItemModel} from "../state/PantryStateConfiguration";

export default {
    title: "Kitchen/NutritionInformation",
    component: NutritionInformation,
};

export const Default = ({model}) => {
    const [item, setItem] = useState<PantryItemModel | undefined>(model);

    return <NutritionInformation input={item} setItem={setItem}/>;
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