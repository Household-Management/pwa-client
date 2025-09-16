import SignIn from "./SignIn";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { Box, Modal } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import { fn } from "storybook/test";

const store = configureStore({
    reducer: state => state || {}
});

export default {
    title: "Authentication/Elements/SignIn",
    render: _args => {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={["/sign-in"]}>
                    <Modal open={true}>
                        <div style={{
                            boxSizing: "border-box",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                            width: "100vw"
                        }}>
                            <Box sx={{
                                boxSizing: "border-box",
                                width: 400,
                                flexShrink: 1,
                                border: "2px solid #000",
                                boxShadow: 24,
                                p: 4,
                                justifyContent: "center",
                                alignContent: "center",
                                display: "flex",
                                bgcolor: "background.paper"
                            }}>
                                <SignIn />
                            </Box>
                        </div>
                    </Modal>
                </MemoryRouter>
            </Provider>
        );
    },
    args: {
        loadTime: 1000,
        errorOnSubmit: null,
        onSubmit: fn()
    }
};

export const SignInComponent = {};