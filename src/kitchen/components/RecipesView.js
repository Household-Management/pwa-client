import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getGroceryLists } from '../store/selectors'; // Adjust the import based on the actual path

const GroceryView = () => {
    const groceryLists = useSelector(getGroceryLists);
    const [selectedListId, setSelectedListId] = useState(groceryLists[0]?.id || null);

    const selectedList = groceryLists.find(list => list.id === selectedListId);

    return (
        <div>
            <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #ccc' }}>
                {groceryLists.map(list => (
                    <div
                        key={list.id}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            backgroundColor: selectedListId === list.id ? '#ddd' : '#fff'
                        }}
                        onClick={() => setSelectedListId(list.id)}
                    >
                        {list.name}
                    </div>
                ))}
            </div>
            <div style={{ padding: '20px' }}>
                {selectedList?.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <input type="checkbox" checked={item.bought} readOnly />
                        <span style={{ marginLeft: '10px' }}>{item.name}</span>
                        <span style={{ marginLeft: 'auto' }}>Quantity: {item.quantity}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GroceryView;
