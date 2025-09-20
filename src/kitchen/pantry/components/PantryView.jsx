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
// TODO: Notifications of expiring items.
// TODO: Implemenet assigning items to grocery list on expiration/usage.
const PantryView = props => {
    const dispatch = useDispatch();
    const items = useSelector(state => {
        return state.household.kitchen.pantry.items;
    });
    const locations = useSelector(state => state.household.kitchen.pantry.locations);

    const [itemName, setItemName] = useState("");
    const [openDialog, setOpenDialog] = useState(null)

    const [editingItem, setEditingItem] = useState(null);

    const handleAddItem = (newItem) => {
        if (itemName) {
            dispatch(AddPantryItem(newItem));
            setItemName("");
            setExpirationDate("");
        }
    };
    const handleAddLocation = (locationName) => {
        if (locationName) {
            dispatch(AddLocation(locationName));
        }
    }
    const handleUpdateItem = () => {
        dispatch(UpdatePantryItem(editingItem));
        setEditingItem(null);
    }

    const handleDelete = () => {
        if (itemToDelete) {
            dispatch(RemovePantryItem(itemToDelete.id));
            setItemToDelete(null);
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
                        {items.map((item) => {
                            const isEditing = editingItem && editingItem.id === item.id;
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
                                    <TableCell sx={{borderRight: "1px solid rgb(224, 224, 244)"}}>
                                        {isEditing ? (
                                            <TextField
                                                value={editingItem.name}
                                                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                                fullWidth
                                            />
                                        ) : (
                                            item.name
                                        )}
                                    </TableCell>
                                    <TableCell sx={{borderRight: "1px solid rgb(224, 224, 244)", textAlign: "center"}}>
                                        {isEditing ? (
                                            <select
                                                value={editingItem.location}
                                                onChange={(e) => setEditingItem({
                                                    ...editingItem,
                                                    location: e.target.value
                                                })}
                                                style={{width: "100%"}}
                                            >
                                                <option value="" disabled>Select Location</option>
                                                {locations.map((location) => (
                                                    <option key={location} value={location}>{location}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            item.location || "?"
                                        )}
                                    </TableCell>
                                    <TableCell sx={{borderRight: "1px solid rgb(224, 224, 244)", textAlign: "center"}}>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editingItem.expiration}
                                                onChange={(e) => setEditingItem({
                                                    ...editingItem,
                                                    expiration: e.target.value
                                                })}
                                                style={{width: "100%"}}
                                            />
                                        ) : (
                                            expirationRemaining !== 9999 ? expiration : "N/A"
                                        )}
                                    </TableCell>
                                    <TableCell sx={{borderRight: "1px solid rgb(224, 224, 244)", textAlign: "center"}}>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editingItem.quantity || 1}
                                                onChange={(e) => setEditingItem({
                                                    ...editingItem,
                                                    quantity: Number(e.target.value)
                                                })}
                                                style={{width: "100%"}}
                                            />
                                        ) : (
                                            item.quantity || 1
                                        )}
                                    </TableCell>
                                    <TableCell sx={{borderRight: "1px solid rgb(224, 224, 244)", textAlign: "center"}}>
                                        {isEditing ? (
                                            <TextField
                                                value={editingItem.units || ""}
                                                onChange={(e) => setEditingItem({
                                                    ...editingItem,
                                                    units: e.target.value
                                                })}
                                                fullWidth
                                            />
                                        ) : (
                                            item.units || "N/A"
                                        )}
                                    </TableCell>
                                    <TableCell sx={{borderRight: "1px solid rgb(224, 224, 244)", textAlign: "center"}}>
                                        {isEditing ? (
                                            <>
                                                <Button onClick={handleUpdateItem}>Save</Button>
                                                <Button onClick={() => setEditingItem(null)}>Cancel</Button>
                                            </>
                                        ) : (
                                            <>
                                                <IconButton onClick={() => setEditingItem(item)}>
                                                    <Edit/>
                                                </IconButton>
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {!isEditing &&
                                            (<>
                                                    <IconButton onClick={() => {
                                                        setOpenDialog(null)
                                                    }}>
                                                        <Delete/>
                                                    </IconButton>
                                                </>
                                            )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
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

            {/*<Accordion>*/}
            {/*    <AccordionSummary*/}
            {/*        expandIcon={<ExpandMoreIcon/>}*/}
            {/*        aria-controls="panel1a-content"*/}
            {/*        id="panel1a-header"*/}
            {/*    >*/}
            {/*        <Typography>Locations</Typography>*/}
            {/*    </AccordionSummary>*/}
            {/*    <AccordionDetails>*/}
            {/*        <TableContainer component={Paper}>*/}
            {/*            <Table>*/}
            {/*                <TableHead>*/}
            {/*                    <TableRow>*/}
            {/*                        <TableCell sx={{width: "80%"}}><strong>Name</strong></TableCell>*/}
            {/*                    </TableRow>*/}
            {/*                </TableHead>*/}
            {/*                <TableBody>*/}
            {/*                    {locations.map((location) => (*/}
            {/*                        <TableRow key={location}>*/}
            {/*                            <TableCell>{location}</TableCell>*/}
            {/*                            /!* TODO: Add back delete when create is implemented. *!/*/}
            {/*                        </TableRow>*/}
            {/*                    ))}*/}
            {/*                </TableBody>*/}
            {/*            </Table>*/}
            {/*        </TableContainer>*/}
            {/*    </AccordionDetails>*/}
            {/*</Accordion>*/}

            <NewLocationDialog
                isDialogOpen={"new-location" === openDialog}
                setOpenDialog={setOpenDialog}
                handleAddLocation={handleAddLocation}
            />

            <NewItemDialog
                isDialogOpen={"new-item" === openDialog}
                setOpenDialog={setOpenDialog}
                handleAddItem={handleAddItem}
                locations={locations}
            />

            <DeleteItemDialog
                isDialogOpen={"delete-item" === openDialog}
            />
        </div>
    );
};

function NewLocationDialog({isDialogOpen, setIsDialogOpen, handleAddLocation}) {
    const [locationName, setLocationName] = useState("");
    return <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
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
            <Button onClick={() => setIsDialogOpen(null)}>Cancel</Button>
            <Button onClick={() => handleAddLocation(locationName)}>Add</Button>
        </DialogActions>
    </Dialog>
}

function NewItemDialog({isDialogOpen, setIsDialogOpen, locations, handleAddItem}) {
    const [item, setItem] = useState("");
    return <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
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
                value={item.expirationDate}
                onChange={(e) => setItem({...item, expirationDate: e.target.value})}
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
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem}>Add</Button>
        </DialogActions>
    </Dialog>
}

function DeleteItemDialog({itemToDelete, isDialogOpen, setDialogOpen, handleDelete}) {
    return <Dialog open={isDialogOpen} onClose={() => setDialogOpen(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure you want to delete the item "{itemToDelete?.name}"?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDialogOpen(null)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
    </Dialog>
}

export default PantryView;