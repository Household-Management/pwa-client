import {useSelector, useDispatch} from "react-redux";
import {actions} from "../state/KitchenStateConfiguration";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import moment from "moment";
// TODO: Notifications of expiring items.
const PantryView = props => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.kitchen.pantry.items);
    const locations = useSelector(state => state.kitchen.pantry.locations);

    const [itemName, setItemName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [itemLocation, setItemLocation] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [locationName, setLocationName] = useState("");

    const handleAddItem = () => {
        if (itemName) {
            const newItem = {
                id: crypto.randomUUID(),
                name: itemName,
                expiration: expirationDate
            };
            dispatch(actions.pantry.AddItem(newItem));
            setItemName("");
            setExpirationDate("");
        }
    };
    const handleAddLocation = () => {
        if (locationName) {
            dispatch(actions.pantry.AddLocation(locationName));
            setLocationName("");
            setIsDialogOpen(false)
        }
    }

    return (
        <div className="pantry-container">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{width: "60%"}}>Item</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Expiration</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => {
                            const expirationRemaining = item.expiration ? moment(item.expiration).diff(moment(), "days") : 9999;
                            let backgroundColor = "inherit";
                            let expiration = (<strong>{item.expiration}</strong>);
                            if (expirationRemaining < 0) {
                                expiration = (<strong style={{"color": "red"}}>{item.expiration}</strong>)
                                backgroundColor = "rgba(255, 0, 0, 0.2)";
                            } else if (expirationRemaining < 3) {
                                expiration = (<strong style={{"color": "orange"}}>{item.expiration}</strong>)
                                backgroundColor = "rgba(255, 255, 0, 0.2)";
                            }

                            return (<TableRow key={item.id}
                                              sx={{backgroundColor: backgroundColor}}>
                                <TableCell sx={{borderRight: "1px solid rgb(224, 224, 244)"}}>{item.name}</TableCell>
                                <TableCell sx={{
                                    borderRight: "1px solid rgb(224, 224, 244)",
                                    textAlign: "center"
                                }}>{item.location || "?"}</TableCell>
                                <TableCell sx={{
                                    borderRight: "1px solid rgb(224, 224, 244)",
                                    textAlign: "center"
                                }}>{expirationRemaining !== 9999 ? expiration : "N/A"}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => dispatch(actions.pantry.RemoveItem(item.id))}>
                                        <Delete/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>)
                        })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
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
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddLocation}>Add</Button>
                </DialogActions>
            </Dialog>
            <div id="new-item" style={{padding: "2rem"}}>
                <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Item Name"
                />
                <div>Location</div>
                <select
                    onChange={(e) => {
                        setItemLocation(e.target.value);
                        if (e.target.value === "new") {
                            setIsDialogOpen(true)
                        }
                    }}
                >
                    <option value="" disabled selected>Select Location</option>
                    {locations.map((location) => (<option key={location} value={location}>{location}</option>))}
                    <option value="new">New...</option>
                </select>
                <div>Expires</div>
                <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                />
                <button onClick={handleAddItem}>Add Item</button>
            </div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Edit Locations</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "80%" }}>Location</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {locations.map((location) => (
                                    <TableRow key={location}>
                                        <TableCell>{location}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => dispatch(actions.pantry.RemoveLocation(location))}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default PantryView;