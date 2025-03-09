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
    Typography, Box
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Delete from "@mui/icons-material/Delete"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import moment from "moment";
// TODO: Notifications of expiring items.
// TODO: Implemenet assigning items to grocery list on expiration/usage.
const PantryView = props => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.kitchen.pantry.items);
    const locations = useSelector(state => state.kitchen.pantry.locations);

    const [itemName, setItemName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [itemLocation, setItemLocation] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [quantity, setQuantity] = useState(1);

    const [locationName, setLocationName] = useState("");

    const handleAddItem = () => {
        if (itemName) {
            const newItem = {
                id: crypto.randomUUID(),
                name: itemName,
                expiration: expirationDate,
                location: itemLocation
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
        <div className="pantry-container" style={{height: "100%"}}>
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
                            } else if (expirationRemaining <= 3) {
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
            <Box style={{padding: "2rem"}}>
                <Grid
                    container
                    spacing={4}>
                    <Grid size={{xs: 12, md: 6, lg: 4}}>
                        <div>New Item</div>
                        <input
                            style={{width: "100%"}}
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder="Item Name"
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 6, lg: 2}}>
                        <div>Location</div>
                        <select
                            onChange={(e) => {
                                setItemLocation(e.target.value);
                                if (e.target.value === "new") {
                                    setIsDialogOpen(true)
                                }
                            }}
                            style={{width: "100%"}}
                            defaultValue={""}
                        >
                            <option value="" disabled>Select Location</option>
                            {locations.map((location) => (<option key={location} value={location}>{location}</option>))}
                            {/*<option value="new">New...</option>*/}
                        </select>
                    </Grid>
                    <Grid size={{xs: 12, md: 6, lg: 2}}>
                        <div>Quantity</div>
                        <input
                            type="number"
                            value={quantity}
                            style={{width: "100%"}}
                            onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 6, lg: 2}}>
                        <div>Expires</div>
                        <input
                            type="date"
                            value={expirationDate}
                            style={{width: "100%"}}
                            onChange={(e) => setExpirationDate(e.target.value)}
                        />

                    </Grid>
                    {/* TODO: Replace with material button */}
                    <Grid size={{xs: 12, lg: 2}}>
                        <button onClick={handleAddItem}>Add Item</button>
                    </Grid>
                </Grid>
            </Box>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
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
                                    <TableCell sx={{width: "80%"}}><strong>Location</strong></TableCell>
                                    {/*<TableCell>Delete</TableCell>*/}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {locations.map((location) => (
                                    <TableRow key={location}>
                                        <TableCell>{location}</TableCell>
                                        {/* TODO: Add back delete when create is implemented. */}
                                        {/*<TableCell>*/}
                                        {/*    <IconButton onClick={() => dispatch(actions.pantry.RemoveLocation(location))}>*/}
                                        {/*        <Delete />*/}
                                        {/*    </IconButton>*/}
                                        {/*</TableCell>*/}
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