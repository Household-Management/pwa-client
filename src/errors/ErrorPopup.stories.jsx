import React, { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import { Button } from "@mui/material";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const mockStore = configureStore({
    reducer: {
        errors: () => [{ message: "An unexpected error occurred. Please try again later." }],
    },
});

export default {
    title: "Errors/ErrorPopup",
    component: ErrorPopup,
};

export const WithButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <Provider store={mockStore}>
            <div>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Show Error Popup
                </Button>
                <ErrorPopup open={open} onClose={() => setOpen(false)} />
            </div>
        </Provider>
    );
};