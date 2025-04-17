import {useDispatch} from "react-redux";
import React, {useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Paper} from "@mui/material";
import {Add, Delete, ExpandLess, ExpandMore} from "@mui/icons-material";
import {AddGroceryListItem, RemoveGroceryListItem, ReplaceGroceryListItem} from "../state/GroceriesStateConfiguration";

const units = ["kg", "g", "lb", "oz", "l", "ml", "cup", "tbsp", "tsp"]; // Suggested units

export default function ({list, expanded, expandedSetter}) {
    const dispatch = useDispatch();
    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState(1);
    const [newItemUnit, setNewItemUnit] = useState(""); // New state for units

    const boughtItemCount = list.items.filter(item => item.bought).length;
    const totalItemCount = list.items.length;
    return <Accordion sx={{flexGrow: 1}} key={list.id} expanded={expanded}
                      onChange={() => expandedSetter(!expanded)}>
        <AccordionSummary
            className="grocery-list-summary"
            sx={{justifyContent: "start-flex", flexGrow: 0}}
        >{list.name} ({boughtItemCount}/{totalItemCount}){expanded ? <ExpandLess/> : <ExpandMore/>}</AccordionSummary>
        <AccordionDetails>
            {list.items.map((item, index) => {
                return (
                    <Paper key={index}
                           style={{
                               display: 'flex',
                               flexGrow: 1,
                               alignItems: 'center',
                               marginBottom: '10px',
                               minHeight: '45px'
                           }}>
                        <input type="checkbox" checked={item.bought}
                               onChange={() => {
                                   dispatch(ReplaceGroceryListItem({
                                       listId: list.id,
                                       item: {...item, bought: !item.bought}
                                   }))
                               }}/>
                        <div style={{flexGrow: 1, textAlign: 'left'}}>
                            {item.bought ? <s>{item.quantity} {item.unit} x {item.name}</s> :
                                <span>{item.quantity} {item.unit} x {item.name}</span>}
                        </div>
                        <IconButton onClick={() => dispatch(RemoveGroceryListItem({
                            listId: list.id,
                            itemId: item.id
                        }))}>
                            <Delete/>
                        </IconButton>
                    </Paper>
                );
            })}
            <div>
                Add Item {/* Todo: Center text vertically*/}
            </div>
            <Paper sx={{flexDirection: "row", display: "flex", width: "100%"}}>
                <div className="grocery-new-item-container">
                    <div className="grocery-new-item-container-inputs">
                        <input style={{flexGrow: 7}} type="text" value={newItemName} placeholder="Name"
                               onChange={ev => setNewItemName(ev.target.value)}/>
                        <input style={{flexGrow: 1}} type="number" value={Math.max(1, newItemQuantity)}
                               onChange={ev => setNewItemQuantity(Number.parseInt(ev.target.value))}/>
                        <input list="unit-suggestions" style={{flexGrow: 1}} type="text" value={newItemUnit}
                               placeholder="Unit"
                               onChange={ev => setNewItemUnit(ev.target.value)}/> {/* Input with datalist for units */}
                        <datalist id="unit-suggestions">
                            {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </datalist>
                    </div>
                    <div className="grocery-new-item-container-buttons">
                        <Button onClick={() => dispatch(AddGroceryListItem({
                            listId: list.id,
                            itemName: newItemName,
                            quantity: newItemQuantity,
                            unit: newItemUnit // Include unit in the dispatched action
                        }))}
                                variant="contained"
                        >
                            <Add/>
                        </Button>
                    </div>
                </div>
            </Paper>
        </AccordionDetails>
    </Accordion>
}