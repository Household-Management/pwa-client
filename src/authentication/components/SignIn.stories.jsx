import SignIn from "./SignIn";
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import {reactRouterParameters, withRouter} from "storybook-addon-remix-react-router";
import {Box, Modal} from "@mui/material";
import {fn} from "@storybook/test";

const store = configureStore({
    reducer: state => state || {}
});

export default {
    render: args => {
        return <Provider store={store}>
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
                        <SignIn onSubmit={async (email, password) => {
                            args.onSubmit(email, password);
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    if(args.errorOnSubmit) {
                                        reject(args.errorOnSubmit);
                                    } else {
                                        resolve();
                                    }
                                }, args.loadTime);
                            })
                        }}/>
                    </Box>
                </div>
            </Modal>
        </Provider>


    },
    decorators: [
        withRouter
    ],
    parameters: {
        reactRouter: reactRouterParameters({
            location: {
                path: "/sign-in",
            },
            routing: [{
                path: "/sign-in",
            }]
        })
    },
    args: {
        loadTime: 1000,
        errorOnSubmit: null,
        onSubmit: fn()
    }
}

export const SignInComponent = {}