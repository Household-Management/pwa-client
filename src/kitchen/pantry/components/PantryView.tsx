import {useSelector, useDispatch} from "react-redux";
import {Dispatch, SetStateAction, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField, DialogContentText,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete"
import Edit from "@mui/icons-material/Edit"
import Add from "@mui/icons-material/Add";
import MenuBook from "@mui/icons-material/MenuBook"
import {
    AddPantryItem,
    UpdatePantryItem,
    RemovePantryItem,
    PantryItem,
} from "../state/PantryStateConfiguration";

import moment from "moment";
import NutritionInformationDialog from "./NutritionInformationDialog.tsx";
import NutritionInformation from "./NutritionInformation.tsx";
import PantryItemProxy from "../state/PantryItemProxy.ts";

export const EDIT_ITEM_DIALOG = "edit-item";
const DELETE_ITEM_DIALOG = "delete-item";
const NEW_ITEM_DIALOG = "new-item";
const NEW_LOCATION_DIALOG = "new-location";
export const VIEW_NUTRITION_DIALOG = "view-nutrition";

export type PantryDialogKind = "edit-item" | "delete-item" | "new-item" | "new-location" | "view-nutrition" | null;

// TODO: Notifications of expiring items.
// TODO: Implement adding items to grocery list on expiration/usage.
const PantryView = (_props: any) => {
    const dispatch = useDispatch();
    const pantry = useSelector((state: any) => state.household.kitchen.pantry)
    const items = useSelector((state: any) => {
        return state.household.kitchen.pantry.items;
    });
    const locations = useSelector((state: any) => state.household.kitchen.pantry.locations);

    const [openDialog, setOpenDialog] = useState<PantryDialogKind>(null);
    // Make sure to use undefined, not null, so the default in ItemDialog is used.
    const [targetItem, setTargetItem] = useState<PantryItem | undefined>(undefined);

    const handleAddItem = (newItem) => {
        if (newItem.item.name) {
            dispatch(AddPantryItem(newItem));
            setOpenDialog(null);
        }
    };

    const handleAddLocation = (locationName) => {
        if (locationName) {
            // dispatch(AddLocation(locationName));
        }
    }

    const handleUpdateItem = (item) => {
        dispatch(UpdatePantryItem(item));
        setOpenDialog(null)
    }

    const handleDelete = (item) => {
        if (item) {
            dispatch(RemovePantryItem({itemId: item.id, pantryId: pantry.id}));
            setOpenDialog(null);
            setTargetItem(undefined);
        }
    };

    return (
        <div className="pantry-container" style={{height: "100%"}}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{textAlign: "center"}}></TableCell>
                            <TableCell sx={{textAlign: "center"}}>Location</TableCell>
                            <TableCell sx={{textAlign: "center"}}>Expiration</TableCell>
                            <TableCell sx={{textAlign: "center"}}>Quantity</TableCell>
                            <TableCell sx={{textAlign: "center"}}>Units</TableCell>
                            <TableCell sx={{textAlign: "center"}}>Nutrition</TableCell>
                            <TableCell sx={{textAlign: "center"}}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => <PantryTableRow
                            value={item}
                            setTargetItem={setTargetItem}
                            setOpenDialog={setOpenDialog}
                        />)}
                        <TableRow>
                            <TableCell colSpan={9} align="center">
                                <Button
                                    sx={{width: "100%"}}
                                    size="large"
                                    color="primary"
                                    onClick={() => {
                                        setTargetItem({
                                            item: {
                                                id: "",
                                                name: "",
                                                nutrition: {
                                                    calories: 0,
                                                    protein: 0,
                                                    fat: 0,
                                                    carbohydrates: 0,
                                                },
                                            },
                                            state: {
                                                pantryId: pantry.id,
                                                location: "",
                                                quantity: 1,
                                                units: "",
                                            }
                                        })
                                        setOpenDialog(NEW_ITEM_DIALOG)
                                    }}
                                >
                                    <Add/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <NewLocationDialog
                open={NEW_LOCATION_DIALOG === openDialog}
                setOpenDialog={setOpenDialog}
                handleAddLocation={handleAddLocation}
            />

            {targetItem && <ItemDialog
                open={NEW_ITEM_DIALOG === openDialog}
                setOpenDialog={setOpenDialog}
                handleFinishItem={handleAddItem}
                locations={locations}
                input={targetItem as PantryItem}
                setItem={setTargetItem}
            />}

            {targetItem && <ItemDialog
                open={EDIT_ITEM_DIALOG === openDialog}
                setOpenDialog={setOpenDialog}
                handleFinishItem={handleUpdateItem}
                locations={locations}
                input={targetItem}
                setItem={setTargetItem}
            />}

            <DeleteItemDialog
                itemToDelete={targetItem}
                open={"delete-item" === openDialog}
                setOpenDialog={setOpenDialog}
                handleDelete={handleDelete}
            />

            {targetItem &&
                <NutritionInformationDialog
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    targetItem={targetItem}/>
            }
        </div>
    );
};

function NewLocationDialog({open, setOpenDialog, handleAddLocation}) {
    const [locationName, setLocationName] = useState("");
    return <Dialog open={open} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Location</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Enter the name of the new location.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="Location Name"
                type="text"
                fullWidth
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button onClick={() => handleAddLocation(locationName)}>Add</Button>
        </DialogActions>
    </Dialog>
}

function ItemDialog({open, setOpenDialog, locations, handleFinishItem, input, setItem}: {
    open: boolean,
    setOpenDialog: Dispatch<SetStateAction<PantryDialogKind>>,
    locations: string[],
    handleFinishItem: (item: PantryItem) => void,
    input: PantryItem,
    setItem: Dispatch<SetStateAction<PantryItem | undefined>>
}) {
    const item = PantryItemProxy.proxy(input);
    const valid = input && input.item.name && input.item.name.length > 0;
    return <Dialog open={open} onClose={() => setOpenDialog(null)}>
        <DialogTitle></DialogTitle>
        <DialogContent>
            <DialogContentText>

            </DialogContentText>
            <>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Item Name"
                    type="text"
                    fullWidth
                    value={item.name}
                    onChange={(e) => setItem({
                        ...input,
                        item: {
                            ...input.item,
                            name: e.target.value
                        }
                    })}
                />
                <TextField
                    margin="dense"
                    label="Expiration Date"
                    type="date"
                    fullWidth
                    value={item.expiration}
                    onChange={(e) => setItem({
                        ...input,
                        state: {
                            ...input.state,
                            expiration: e.target.value
                        }
                    })}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <select
                    onChange={(e) => setItem({...input, state: {...input.state, location: e.target.value}})}
                    style={{width: "100%", marginTop: "1rem"}}
                    defaultValue={""}
                >
                    <option value="" disabled>Select Location</option>
                    {locations.map((location) => (<option key={location} value={location}>{location}</option>))}
                </select>
                <TextField
                    type="number"
                    style={{width: "50%", marginTop: "1rem"}}
                    value={item.quantity}
                    onChange={(e) => setItem({
                        ...input,
                        state: {
                            ...input.state,
                            quantity: Number(e.target.value)
                        }
                    })}
                    label="Quantity"
                />
                {/* Add some predefined units or let the user enter their own */}
                <TextField
                    type="text"
                    style={{width: "50%", marginTop: "1rem"}}
                    value={item.units}
                    label="Units"
                    onChange={(e) => setItem({
                        ...input,
                        state: {
                            ...input.state,
                            units: e.target.value
                        }
                    })}
                />
            </>
            <Accordion>
                <AccordionSummary>
                    Nutrition Info
                </AccordionSummary>
                <AccordionDetails>
                    <NutritionInformation value={input} setItem={setItem}/>
                </AccordionDetails>

            </Accordion>
        </DialogContent>
        <DialogActions
            sx={{width: "50%", marginLeft: "50%", justifyContent: "space-around", paddingLeft: 0, paddingRight: 0}}>
            <Button disabled={!valid} onClick={() => handleFinishItem(input)}>Add</Button>
            <Button color="error" onClick={() => setOpenDialog(null)}>Cancel</Button>
        </DialogActions>
    </Dialog>
}

function DeleteItemDialog({open, itemToDelete, setOpenDialog, handleDelete}) {
    return <Dialog open={open} onClose={() => setOpenDialog(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to delete the item "{itemToDelete?.name}"?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
            <Button onClick={() => handleDelete(itemToDelete)} color="error">Delete</Button>
        </DialogActions>
    </Dialog>
}

export function PantryTableRow({value, setTargetItem, setOpenDialog}) {
    const item = PantryItemProxy.proxy(value);
    const expirationRemaining = item.expiration ? moment(item.expiration).diff(moment(), "days") : 9999;
    let backgroundColor = "inherit";
    let expiration = (<strong>{item.expiration}</strong>);
    if (expirationRemaining < 0) {
        expiration = (<strong style={{"color": "red"}}>{item.expiration}</strong>);
        backgroundColor = "rgba(255, 0, 0, 0.2)";
    } else if (expirationRemaining <= 3) {
        expiration = (<strong style={{"color": "orange"}}>{item.expiration}</strong>);
        backgroundColor = "rgba(255, 255, 0, 0.2)";
    }

    return (
        <TableRow key={item.id} sx={{backgroundColor: backgroundColor}}>
            <TableCell sx={{textAlign: "center"}}>
                <Button sx={{
                    height: "100%",
                    width: "100%",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "space-between"
                }}
                        variant="contained"
                        color="primary" onClick={() => {
                    setTargetItem(item);
                    setOpenDialog(EDIT_ITEM_DIALOG);
                }}
                        startIcon={<Edit/>}
                >
                    <strong>{item.name}</strong>
                </Button>
            </TableCell>
            <TableCell sx={{textAlign: "center"}}>{item.location || "?"}</TableCell>
            <TableCell sx={{textAlign: "center"}}>{expirationRemaining !== 9999 ? expiration : "N/A"}</TableCell>
            <TableCell sx={{textAlign: "center"}}>{item.quantity || 1}</TableCell>
            <TableCell sx={{textAlign: "center"}}>{item.units || "N/A"}</TableCell>
            <TableCell sx={{textAlign: "center"}}>
                <Button sx={{height: "100%", width: "100%"}} color="primary" onClick={() => {
                    setTargetItem(item);
                    setOpenDialog(VIEW_NUTRITION_DIALOG);
                }}>
                    <MenuBook/>
                </Button>
            </TableCell>
            <TableCell sx={{textAlign: "center"}}>
                <Button sx={{height: "100%", width: "100%"}} color="error" onClick={() => {
                    setTargetItem(item);
                    setOpenDialog(DELETE_ITEM_DIALOG);
                }}>
                    <Delete/>
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default PantryView;