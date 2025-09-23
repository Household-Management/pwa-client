import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {EDIT_ITEM_DIALOG, PantryDialogKind, VIEW_NUTRITION_DIALOG} from "./PantryView";
import NutritionInformation from "./NutritionInformation";
import {PantryItem} from "../state/PantryStateConfiguration";

export default function NutritionInformationDialog({openDialog, setOpenDialog, targetItem}: {
    openDialog: string | null,
    setOpenDialog: (dialog: PantryDialogKind) => void,
    targetItem?: PantryItem
}) {
    return <Dialog open={openDialog === VIEW_NUTRITION_DIALOG}>
        <DialogTitle>
            {targetItem?.item?.name || "Unknown"} Nutrition
        </DialogTitle>
        <DialogContent>
            {targetItem && <NutritionInformation value={targetItem as PantryItem}/>}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenDialog(EDIT_ITEM_DIALOG)}>Edit</Button>
            <Button onClick={() => setOpenDialog(null)}>Close</Button>
        </DialogActions>
    </Dialog>
}