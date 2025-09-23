import {PantryItem} from "../state/PantryStateConfiguration.ts";
import PantryItemProxy from "../state/PantryItemProxy";
import {Dispatch, SetStateAction} from "react";
import {TextField} from "@mui/material";

export default function NutritionInformation({value , setItem}: {
    value: PantryItem,
    setItem?: Dispatch<SetStateAction<PantryItem | undefined>>
}) {
    const proxied = PantryItemProxy.proxy(value);
    return (
        <>
            <TextField
                type="text"
                label="Serving Size"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={proxied.nutrition?.servingSize || ""}
                onChange={(e: any) => setItem && setItem({
                    ...value,
                    item: {
                        ...value.item,
                        nutrition: {
                            ...value.item.nutrition, servingSize: e.target.value
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
                value={proxied.nutrition?.calories || 0}
                onChange={(e) => setItem && setItem({
                    ...value,
                    item: {
                        ...value.item,
                        nutrition: {...proxied.nutrition, calories: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Protein (g)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={proxied.nutrition?.protein || ""}
                onChange={(e) => setItem && setItem({
                    ...value,
                    item: {
                        ...value.item,
                        nutrition: {...proxied.nutrition, protein: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Fat (g)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={proxied.nutrition?.fat || ""}
                onChange={(e) => setItem && setItem({
                    ...value,
                    item: {
                        ...value.item,
                        nutrition: {...proxied.nutrition, fat: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Carbohydrates (g)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={proxied.nutrition?.carbohydrates || ""}
                onChange={(e) => setItem && setItem({
                    ...value,
                    item: {
                        ...value.item,
                        nutrition: {...value.item.nutrition, carbohydrates: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Fiber (g)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={proxied.nutrition?.fiber || ""}
                onChange={(e) => setItem && setItem({
                    ...value,
                    item: {
                        ...value.item,
                        nutrition: {...value.item.nutrition, fiber: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Sugar (g)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={proxied.nutrition?.sugar || ""}
                onChange={(e) => setItem && setItem({
                    ...value,
                    item: {
                        ...value.item,
                        nutrition: {...value.item.nutrition, sugar: Number(e.target.value)}
                    }
                })}
            />
            <TextField
                type="number"
                label="Sodium (mg)"
                fullWidth
                disabled={!setItem}
                margin="dense"
                value={proxied.nutrition?.sodium || ""}
                onChange={(e) => setItem && setItem({
                    ...value,
                    item: {
                        ...value.item,
                        nutrition: {...value.item.nutrition, sodium: Number(e.target.value)}
                    }
                })}
            />
        </>)
};