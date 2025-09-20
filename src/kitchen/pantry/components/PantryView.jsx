import {useSelector, useDispatch} from "react-redux";
import {useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Paper, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField, DialogContentText,
    Typography
} from "@mui/material";
import Delete from "@mui/icons-material/Delete"
import Edit from "@mui/icons-material/Edit"
import Add from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {AddPantryItem, UpdatePantryItem, RemovePantryItem} from "../state/PantryStateConfiguration";

import moment from "moment";

const EDIT_ITEM_DIALOG = "edit-item";
const DELETE_ITEM_DIALOG = "delete-item";
const NEW_ITEM_DIALOG = "new-item";
const NEW_LOCATION_DIALOG = "new-location";

// TODO: Notifications of expiring items.
// TODO: Implement adding items to grocery list on expiration/usage.
const PantryView = props => {
    const dispatch = useDispatch();
    const items = useSelector(state => {
        return state.household.kitchen.pantry.items;
    });
    const locations = useSelector(state => state.household.kitchen.pantry.locations);

    const [openDialog, setOpenDialog] = useState(null);
    // Make sure to use undefined, not null, so the default in ItemDialog is used.
    const [targetItem, setTargetItem] = useState(undefined);

    const handleAddItem = (newItem) => {
        if (newItem.name) {
            dispatch(AddPantryItem(newItem));
            setOpenDialog(null);
        }
    };
    const handleAddLocation = (locationName) => {
        if (locationName) {
            dispatch(AddLocation(locationName));
        }
    }

    const handleUpdateItem = (item) => {
        dispatch(UpdatePantryItem(item));
        setOpenDialog(null)
    }

    const handleDelete = (item) => {
        if (item) {
            dispatch(RemovePantryItem(item.id));
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
                            <TableCell sx={{width: "60%"}}>Item</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Expiration</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Units</TableCell>
                            <TableCell>Edit</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => <PantryTableRow
                            item={item}
                            setTargetItem={setTargetItem}
                            setOpenDialog={setOpenDialog}
                        />)}
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <Button
                                    sx={{width: "100%"}}
                                    size="large"
                                    color="primary"
                                    onClick={() => setOpenDialog("new-item")}
                                >
                                    <Add/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <NewLocationDialog
                open={"new-location" === openDialog}
                setOpenDialog={setOpenDialog}
                handleAddLocation={handleAddLocation}
            />

            <ItemDialog
                open={"new-item" === openDialog}
                setOpenDialog={setOpenDialog}
                handleFinishItem={handleAddItem}
                locations={locations}
            />

            <ItemDialog
                open={EDIT_ITEM_DIALOG === openDialog}
                setOpenDialog={setOpenDialog}
                handleFinishItem={handleUpdateItem}
                locations={locations}
                item={targetItem}
                setItem={setTargetItem}
            />

            <DeleteItemDialog
                itemToDelete={targetItem}
                open={"delete-item" === openDialog}
                setOpenDialog={setOpenDialog}
                handleDelete={handleDelete}
            />
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

const EMPTY_ITEM = {
    name: "",
    expiration: null,
    location: null,
    quantity: 1,
    units: null
}

function ItemDialog({open, setOpenDialog, locations, handleFinishItem, item = EMPTY_ITEM, setItem}) {
    return <Dialog open={open} onClose={() => setOpenDialog(null)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Enter the details of the new pantry item.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="Item Name"
                type="text"
                fullWidth
                value={item.name}
                onChange={(e) => setItem({...item, name: e.target.value})}
            />
            <TextField
                margin="dense"
                label="Expiration Date"
                type="date"
                fullWidth
                value={item.expiration}
                onChange={(e) => setItem({...item, expiration: e.target.value})}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <select
                onChange={(e) => setItem({...item, location: e.target.value})}
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
                onChange={e => setItem({...item, quantity: Number(e.target.value)})}
                label="Quantity"
            />
            {/* Add some predefined units or let the user enter their own */}
            <TextField
                type="text"
                style={{width: "50%", marginTop: "1rem"}}
                value={item.units}
                label="Units"
            />
        </DialogContent>
        <DialogActions
            sx={{width: "50%", marginLeft: "50%", justifyContent: "space-around", paddingLeft: 0, paddingRight: 0}}>
            <Button onClick={() => handleFinishItem(item)}>Add</Button>
            <Button color="error" onClick={() => setOpenDialog(false)}>Cancel</Button>
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

export function PantryTableRow({item, setTargetItem, setOpenDialog}) {
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
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.location || "?"}</TableCell>
            <TableCell>{expirationRemaining !== 9999 ? expiration : "N/A"}</TableCell>
            <TableCell>{item.quantity || 1}</TableCell>
            <TableCell>{item.units || "N/A"}</TableCell>
            <TableCell>
                <IconButton onClick={() => {
                    setTargetItem(item);
                    setOpenDialog(EDIT_ITEM_DIALOG);
                }}>
                    <Edit/>
                </IconButton>
            </TableCell>
            <TableCell>
                <IconButton disable={true} color="error" onClick={() => {
                    setTargetItem(item);
                    setOpenDialog(DELETE_ITEM_DIALOG);
                }}>
                    <Delete/>
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

export default PantryView;