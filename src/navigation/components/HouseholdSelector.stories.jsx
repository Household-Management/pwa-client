import HouseholdSelectorList from './HouseholdSelectorList';
import {fn} from "@storybook/test";
import {Provider} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import {CookiesProvider} from "react-cookie";

const store = configureStore({
    reducer: (state, action) => {
        return state || {}
    }
})

const meta = {
    component: props => <Provider store={store}>
        <CookiesProvider>
            <HouseholdSelectorList {...props} open={true}/>
        </CookiesProvider>
    </Provider>,
};

export default meta;

export const Default = {
    args: {
        households: [
            {
                name: "John's Household",
            },
            {
                name: "Jane's Household",
            },
            {
                name: "Joe's Household",
            }
        ],
        user: {
            signInDetails: {
                loginId: "someone@email.com"
            }
        },
        loading: false,
        onJoinHousehold: fn(),
        onSelectHousehold: fn(),
        onCreateHousehold: fn()
    }
};