import HouseholdSelectorList from './HouseholdSelectorList';
import { fn } from "@storybook/test";

const meta = {
  component: props => <HouseholdSelectorList {...props} open={true} />,
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

export const Loading = {

}