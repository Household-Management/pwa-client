import { Provider } from "react-redux";
import { HeaderProvider } from "../../layout/hooks/HeaderContext";
import SettingsView from "./SettingsView";
import {configureStore} from "@reduxjs/toolkit";
import { CookiesProvider } from "react-cookie";

const store = configureStore({
    reducer: (state, action) => {
        return state || action.payload;
    }
});

const meta = {
}

export default meta;

const Template = (args) => {
    store.dispatch({
        type: "SET_STATE",
        payload: args
    });
    return (
    <Provider store={store}>
        <CookiesProvider>
        <HeaderProvider>
            <SettingsView {...args} />
        </HeaderProvider>
        </CookiesProvider>
    </Provider>
)};

export const Default: Function & {args: Args} = (Template.bind({}) as unknown) as Function & {args: Args};

type Args = {
    household: {},
    user: {
        roles: string[],
        loginId: string
    }
}

Default.args = {
    household: {
        id: "123",
        name: "Sample Household",
        adminGroup: ["admin:123"],
        membersGroup: ["admin:123"],
    },
    user: {
        "roles" : ["members:456", "admin:123"],
        loginId: "user123"
    }
};