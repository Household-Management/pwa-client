import React, {Fragment, useContext, useEffect, useState} from "react";
import HouseholdSelectorList from "./HouseholdSelectorList";
import {getCurrentUser, fetchAuthSession} from "aws-amplify/auth";
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

    const [processingInvite, setProcessingInvite] = useState(false);
    const [inviteError, setInviteError] = useState(null);

    useEffect(() => {
        if (!householdsLoaded) {
            async function fetchHouseholds() {
                try {
                    setHouseholdsLoaded(true);
                    setCookie('household', null);
                    const user = await getCurrentUser();
                    const userSession = await fetchAuthSession();
                    const response = await dataClient.models.Household.list({
                        filter: {
                            membersGroup: {
                                contains: user.userId
                            }
                        },
                        selectionSet: [
                            "name",
                            "id"
                        ],
                        authMode: "lambda",
                        authToken: `Bearer ${userSession.tokens.accessToken.toString()}`
                    }
                    );
                    if (!response.errors) {
                        setHouseholds(response.data);
                    } else {
                        console.error("Errors on fetching households", response.errors);
                        throw new Error("Failed to fetch households");
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
        setLoading(true);
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
            setLoading(false);
            await selectHousehold(createdHousehold.data);
        })
    };

    async function selectHousehold(household) {
        const selected = await dataClient.models.Household.get(household,
            {
                selectionSet: ["id", "name", "membersGroup", "adminGroup", "householdTasks.*", "householdTasks.taskLists.*", "kitchen.*", "recipes.*", "householdTasks.taskLists.taskItems.*"],

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
        setProcessingInvite(true);
        const user = await getCurrentUser();

        const response = await dataClient.mutations.JoinHousehold({
            inviteCode,
            joinerId: user.userId
        });

        if (response.errors) {
            setInviteError('Failed to join household. Please check the invite code and try again.');
            setProcessingInvite(false);
        } else {
            // TODO: After successfully joining a household, we need to refresh the page to reflect the new household
            setInviteModalOpen(false);
            setInviteError('');
            setProcessingInvite(false);
        }
    }

    return <Fragment>
        <HouseholdSelectorList
            errorMessage={error?.message}
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
            errorMessage={inviteError}
            loading={processingInvite}
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