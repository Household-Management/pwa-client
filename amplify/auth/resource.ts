import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true
  },
});

/**
 * The possible roles in each household.
 *
 * - `owner`: The user who created the household. Has full permissions.
 * - `admin`: A user with elevated permissions to manage household settings and members.
 * - `member`: A regular user who can participate in household activities.
 * - `dependent`: A user with limited permissions, typically a child or guest.
 */
export type AuthRole = "owner" | "admin" | "member" | "dependent";
