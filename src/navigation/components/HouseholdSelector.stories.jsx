import HouseholdSelector from './HouseholdSelector';
import { fn } from "@storybook/test";

const meta = {
  component: HouseholdSelector,
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
    open: true,
    onClick: fn(),
    loading: false
  }
};

export const Loading = {

}