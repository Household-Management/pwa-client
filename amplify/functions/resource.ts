import {defineFunction} from "@aws-amplify/backend";

export const inviteFunction = defineFunction({
    name: "InviteToHousehold",
    entry: "./generate-invite-code/handler.js",
    resourceGroupName: "data"
});

export const joinFunction = defineFunction({
    name: "JoinHousehold",
    entry: "./join-with-invite-code/handler.js",
    resourceGroupName: "data"
});