import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AddGroceryList, AddGroceryListItem} from '../state/GroceriesStateConfiguration';
import GroceryList from "./GroceryList";

const GroceryView = () => {
    const groceryLists = useSelector(state => state.kitchen.groceries.lists);
    const dispatch = useDispatch();
    const [newListName, setNewListName] = useState("");
    const [expanded, setExpanded] = useState({});
    return (
        <div>
            <div style={{display: 'flex', overflowX: 'auto', borderBottom: '1px solid #ccc'}}>
                {groceryLists.map(list => {
                    return <GroceryList key={list.id}
                                        list={list}
                                        expanded={expanded[list.id]}
                                        expandedSetter={(value) => {
                                            expanded[list.id] = value;
                                            setExpanded({...expanded})
                                        }}/>
                })}
            </div>
            <div style={{display: "none"}}>
                <input type="text" placeholder="New List Name" value={newListName}
                       onChange={(ev) => setNewListName(ev.target.value)}/>
                <button onClick={() => {
                    dispatch(AddGroceryList({name: newListName}));
                    setNewListName("");
                }}>Create New List
                </button>
            </div>
        </div>
    );
}
export default GroceryView;
