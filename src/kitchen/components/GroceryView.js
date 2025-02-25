import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Accordion, AccordionSummary, AccordionDetails, Paper, Button, IconButton} from '@mui/material'
import {actions} from '../state/KitchenStateConfiguration';
import {ExpandMore, ExpandLess, Add, Delete} from "@mui/icons-material";
// FIXME: Too wide on mobile
// TODO: Add item count in accordion summary.
const GroceryView = () => {
    const groceryLists = useSelector(state => state.kitchen.groceryLists.lists);
    const dispatch = useDispatch();
    var [newListName, setNewListName] = useState("");
    const [expanded, setExpanded] = useState({});
    return (
        <div>
            <div style={{display: 'flex', overflowX: 'auto', borderBottom: '1px solid #ccc'}}>
                {groceryLists.map(list => (
                    <CustomAccordion list={list} expanded={expanded[list.id]} expandedSetter={(value) => {
                        expanded[list.id] = value;
                        setExpanded({...expanded})
                    }}/>
                ))}
            </div>
            <div style={{display: "none"}}>
                <input type="text" placeholder="New List Name" value={newListName}
                       onChange={(ev) => setNewListName(ev.target.value)}/>
                <button onClick={() => {
                    dispatch(actions.groceryLists.AddList({name: newListName}));
                    setNewListName("");
                }}>Create New List
                </button>
            </div>
        </div>
    );
}

const CustomAccordion = ({list, expanded, expandedSetter}) => {
    const dispatch = useDispatch();
    const [newItemName, setNewItemName] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState(1);

    return (<Accordion sx={{flexGrow: 1}} key={list.id} expanded={expanded}
                       onChange={() => expandedSetter(!expanded)}>
        <AccordionSummary
            className="grocery-list-summary"
            sx={{justifyContent: "start-flex", flexGrow: 0}}
        >{list.name}{expanded ? <ExpandLess/> : <ExpandMore/>}</AccordionSummary>
        <AccordionDetails>
            <div>
                Add Item
            </div>
            <Paper sx={{flexDirection: "row", display: "flex", width: "100%"}}>
                <div className="grocery-new-item-container">
                    <div className="grocery-new-item-container-inputs">
                        <input style={{flexGrow: 9}} type="text" value={newItemName} placeholder="Name"
                               onChange={ev => setNewItemName(ev.target.value)}/>
                        <input style={{flexGrow: 1}} type="number" value={Math.max(1, newItemQuantity)}
                               onChange={ev => setNewItemQuantity(Number.parseInt(ev.target.value))}/>
                    </div>
                    <div className="grocery-new-item-container-buttons">
                    <Button onClick={() => dispatch(actions.groceryLists.AddListItem({
                        listId: list.id,
                        itemName: newItemName,
                        quantity: newItemQuantity
                    }))}
                            variant="contained"
                    >
                        <Add/>
                    </Button>
                    </div>
                </div>
            </Paper>
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
                                   dispatch(actions.groceryLists.ReplaceListItem({
                                       listId: list.id,
                                       item: {...item, bought: !item.bought}
                                   }))
                               }}/>
                        <div style={{flexGrow: 1, textAlign: 'left'}}>
                            {item.bought ? <s>{item.quantity} x {item.name}</s> :
                                <span>{item.quantity} x {item.name}</span>}
                        </div>
                        <IconButton onClick={() => dispatch(actions.groceryLists.RemoveListItem({
                            listId: list.id,
                            itemId: item.id
                        }))}>
                            <Delete/>
                        </IconButton>
                    </Paper>
                );
            })}</AccordionDetails>
    </Accordion>)
}

export default GroceryView;
