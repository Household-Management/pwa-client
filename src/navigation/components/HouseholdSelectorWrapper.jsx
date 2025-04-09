import React, {Fragment, useContext, useEffect, useState} from "react";
import HouseholdSelectorList from "./HouseholdSelectorList";
import {getCurrentUser} from "aws-amplify/auth";
import {DataClientContext} from "../../graphql/DataClient";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import LogOutButton from "../../authentication/components/LogOutButton";
import HouseholdJoinModal from "./HouseholdJoinModal";
// TODO: After selecting a household, show a spinner while it loads
/**
 * Functionality wrapper around the household selection components.
 */
export default function HouseholdSelectorWrapper() {
    const [loading, setLoading] = useState(true);
    const [householdsLoaded, setHouseholdsLoaded] = useState(false);
    const [households, setHouseholds] = useState([]);
    const [error, setError] = useState(null);
    const dataClient = useContext(DataClientContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['household']);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const user = useSelector(state => state.user.user);

    useEffect(() => {
        if (!householdsLoaded) {
            async function fetchHouseholds() {
                try {
                    setHouseholdsLoaded(true);
                    setCookie('household', null);
                    const user = await getCurrentUser();
                    const response = await dataClient.models.Household.list({
                        filter: {
                            membersGroup: {
                                contains: user.userId
                            }
                        },
                        selectionSet: [
                            "name",
                            "id"
                        ]
                    });
                    if (!response.errors) {
                        setHouseholds(response.data);
                    } else {
                        // TODO: Report errors
                    }
                } catch (err) {
                    setError(err);
                } finally {
                    setLoading(false);
                }
            }

            if (cookies.household) {
                selectHousehold({id: cookies.household})
                    .then(() => {
                    }, err => {
                        fetchHouseholds();
                    });
            } else if (open) {
                fetchHouseholds();
            }
        }
    }, [householdsLoaded]);

    const createHousehold = () => {
        console.log("Creating new household...");
        // TODO: Replace after implementation of Issue #11
        getCurrentUser().then(async user => {
            const createdHousehold = await dataClient.models.Household.create({
                name: `${user.signInDetails.loginId}'s Household`,
                membersGroup: [user.userId],
                adminGroup: [user.userId]
            });

            const createdHouseholdTasks = await dataClient.models.HouseholdTasks.create({
                householdId: createdHousehold.data.id,
                membersGroup: [user.userId],
                adminGroup: [user.userId]
            });
            await dataClient.models.TaskList.create({
                householdTasksId: createdHouseholdTasks.data.id,
                membersGroup: [user.userId],
                adminGroup: [user.userId]
            });
            await dataClient.models.Kitchen.create({
                householdId: createdHousehold.data.id,
                membersGroup: [user.userId],
                adminGroup: [user.userId]
            });
            await dataClient.models.HouseholdRecipes.create({
                householdId: createdHousehold.data.id,
                membersGroup: [user.userId],
                adminGroup: [user.userId]
            });
            setLocalloading(false);
            onClick(createdHousehold.data);
        })
    };

    async function selectHousehold(household) {
        const selected = await dataClient.models.Household.get(household,
            {
                selectionSet: ["id", "name", "membersGroup", "adminGroup", "householdTasks.*", "householdTasks.taskLists.*", "kitchen.*", "recipes.*"],

            });
        if (selected.errors) {
            console.error("Errors on selecting household", selected.errors);
            throw new Error();
        }
        if (!selected.data) {
            console.error("No data on selecting household");
            throw new Error();
        }
        if (!selected.errors && selected.data) {
            setCookie('household', household.id);
            dispatch({
                type: "LOADED_STATE",
                payload: await selected.data
            });
            navigate("/tasks");
        }
    }

    async function handleInviteCodeSubmit(inviteCode) {
        const user = await getCurrentUser();

        const response = await dataClient.mutations.JoinHousehold({
            inviteCode,
            joinerId: user.userId
        });
        if (response.errors) {
            setErrorMessage('Failed to join household. Please check the invite code and try again.');
        } else {
            // TODO: After successfully joining a household, we need to refresh the page to reflect the new household
            setInviteCodeModalOpen(false);
            setErrorMessage('');
        }
    }

    return <Fragment>
        <HouseholdSelectorList
            user={user}
            loading={loading}
            households={households}
            onClick={selectHousehold}
            onCreateHousehold={createHousehold}
            onSelectHousehold={selectHousehold}
            onJoinHousehold={setInviteModalOpen.bind(null, true)}
        />
        <LogOutButton label={"Log into a different account"}/>
        <HouseholdJoinModal
            open={inviteModalOpen}
            onCancel={() => setInviteModalOpen(false)}
            onSubmit={handleInviteCodeSubmit}
        />
    </Fragment>
}

async function resolve(data) {
    return Object.keys(data).reduce(async (object, key) => {
        if (data[key].then) {
            object[key] = await data[key];
        } else {
            object[key] = data[key];
        }
        return object;
    }, {});
}