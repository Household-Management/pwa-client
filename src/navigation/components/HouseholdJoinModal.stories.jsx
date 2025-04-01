import { fn } from "@storybook/test";
import HouseholdJoinModal from "./HouseholdJoinModal";

const meta = {
    component: props => <HouseholdJoinModal {...props} open={true} />,
};

export default meta;

export const Default = {
    args: {
        loading: false,
        errorMessage: "",
        onCancel: fn(),
        onSubmit: fn()
    }
};