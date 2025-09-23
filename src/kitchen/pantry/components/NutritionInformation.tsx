import {PantryItemModel} from "../state/PantryStateConfiguration.ts";
import PantryItemProxy from "../state/PantryItemProxy";
import {Dispatch, SetStateAction} from "react";
import {TextField} from "@mui/material";

export default function NutritionInformation({input , setItem}: {
    input?: PantryItemModel,
    setItem?: Dispatch<SetStateAction<PantryItemModel | undefined>>
}) {
    const item = PantryItemProxy.proxy(input);
    return (
        <>
            <TextField
                type="text"
                label="Serving Size"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={item.nutrition?.servingSize || ""}
                onChange={(e: any) => setItem && setItem({
                    ...input,
                    item: {
                        ...input.item,
                        nutrition: {
                            ...input.item.nutrition, servingSize: e.target.value
                        }
                    }
                })}
            />
            {/* FIXME: Keeps leading zero when typing */}
            <TextField
                type="number"
                label="Calories"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={item.nutrition?.calories || 0}
                onChange={(e) => setItem && setItem({
                    ...input,
                    item: {
                        ...input.item,
                        nutrition: {...item.nutrition, calories: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Protein (g)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={item.nutrition?.protein || ""}
                onChange={(e) => setItem && setItem({
                    ...input,
                    item: {
                        ...input.item,
                        nutrition: {...item.nutrition, protein: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Fat (g)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={item.nutrition?.fat || ""}
                onChange={(e) => setItem && setItem({
                    ...input,
                    item: {
                        ...input.item,
                        nutrition: {...item.nutrition, fat: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Carbohydrates (g)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={item.nutrition?.carbohydrates || ""}
                onChange={(e) => setItem && setItem({
                    ...input,
                    item: {
                        ...input.item,
                        nutrition: {...input.item.nutrition, carbohydrates: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Fiber (g)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={item.nutrition?.fiber || ""}
                onChange={(e) => setItem && setItem({
                    ...input,
                    item: {
                        ...input.item,
                        nutrition: {...input.item.nutrition, fiber: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Sugar (g)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={item.nutrition?.sugar || ""}
                onChange={(e) => setItem && setItem({
                    ...input,
                    item: {
                        ...input.item,
                        nutrition: {...input.item.nutrition, sugar: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Sodium (mg)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={item.nutrition?.sodium || ""}
                onChange={(e) => setItem && setItem({
                    ...input,
                    item: {
                        ...input.item,
                        nutrition: {...input.item.nutrition, sodium: Number(e.target.value)}
                    }
                })}
            />
        </>)
};